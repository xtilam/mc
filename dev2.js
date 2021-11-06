const ftp = require('ftp')
const fs = require('fs');
const { dirname } = require('path');
const { zip } = require('zip-a-folder');
const { exit } = require('process');
const config = require('./dev.config');
const { envConfig } = require('./dev.config');
const concurrently = require('concurrently');
const colors = require('colors')
const beautify = require('json-beautify')
const open = require('open')

const axios = require('axios').default.create({
    headers: {
        'Cookie': ' __test=6392a84b233382691ea4837dbad6ca67'
    },
})

const commandAction = {
    deploy: deploy,
}
const [command, argsConfig] = getArgs()

main()

function main() {
    commandAction[command]()
}

function getArgs() {
    const args = process.argv.slice(3, process.argv.length)
    const mapArgs = {}
    const command = process.argv[2]
    if (!args) {
        log(config.helpText)
        exit()
    }
    let propertyCount = -1
    let propertyName
    for (const arg of args) {
        if (arg[0] + arg[1] === '--') {
            propertyName = arg.slice(2, arg.length)
            propertyCount = 0
            mapArgs[propertyName] = true
        } else {
            if (!propertyName) {
                log('Wrong syntax')
                log(config.helpText)
            } else {
                if (propertyCount === 0) {
                    mapArgs[propertyName] = arg
                } else if (propertyCount === 1) {
                    mapArgs[propertyName] = [mapArgs[propertyName], arg]
                } else {
                    mapArgs[propertyName].push(arg)
                }
                ++propertyCount
            }
        }
    }
    return [command, mapArgs]
}

async function deploy() {
    // config path
    const _path = '../'
    const path = {
        pathZip: _path + 'htdocs.zip',
        pathSplitZip: _path + 'htdocs_split',
        pathHtdocs: _path + 'htdocs',
    }
    const hosting = config.hosting[argsConfig['hosting'] || 1]
    const hasVendor = argsConfig['vendor'] || false
    const htdocsFolderServer = argsConfig['public-path'] || hosting.publicPath || 'htdocs'
    const sizeZipSplit = Number.parseFloat(argsConfig['zip-split-size']) || 2
    const artisanCommand = []

    if (Array.isArray(argsConfig['artisan'])) {
        artisanCommand = argsConfig['artisan']
    }

    if (argsConfig['fresh-database']) {
        artisanCommand.push('migrate:fresh --force')
    } else {
        artisanCommand.push('migrate --force')
    }


    log('start deploy hosting: ' + hosting.env.APP_URL)
    // start deploy
    log('clean build ...')
    cleanBuild()

    log('build font-end')
    await buildFontEnd()

    log('copy file ...')
    copyHtdocs()



    if (!hasVendor) {
        fs.rmdirSync(path.pathHtdocs + '/vendor', { recursive: true })
    } else {
        await concurrently([`cd ${fs.realpathSync(path.pathHtdocs)} && composer install --no-dev --optimize-autoloader`])
    }

    log('build zip ...');
    await zip(path.pathHtdocs, path.pathZip)
    if (fs.existsSync(path.pathSplitZip)) fs.rmdirSync(path.pathSplitZip, { recursive: true })
    log('split zip ...')
    const listUpload = await splitZipFile(path.pathZip, path.pathSplitZip, sizeZipSplit)

    log('upload ftp ...')
    await upload()

    log('clean build ...')
    cleanBuild()

    await open(hosting.env.APP_URL)
    exit()

    function getListPath(path, exclude = []) {
        let listPath = []
        if (exclude.length > 0) {
            exclude = exclude.map((value) => {
                return path + '/' + value
            })
        }
        recursive(path)
        return listPath

        function recursive(path, filename) {
            let currentPath = path
            if (fs.existsSync(currentPath)) {
                const stat = fs.lstatSync('./' + currentPath)
                if (!stat.isDirectory()) {
                    if (filename !== '.gitignore' && exclude.findIndex(path => currentPath === path) === -1) listPath.push(currentPath)
                } else {
                    const listFile = fs.readdirSync(path)
                    for (const fileName of listFile) {
                        recursive(currentPath + '/' + fileName, fileName)
                    }
                }
            }
        }
    }

    function copyHtdocs() {
        // copy file from config
        for (const item of config.listFilePush) {
            let input = item.content || item.path
            if (!input) continue
            const pathParent = path.pathHtdocs + '/' + item.path
            if (fs.existsSync(input)) {
                let list = getListPath(input, item.exclude || [])
                if (list.length <= 1) {
                    if (list[0]) {
                        fs.mkdirSync(dirname(pathParent), { recursive: true })
                        fs.copyFileSync(list[0], path.pathHtdocs + '/' + item.path)
                    }
                } else {
                    for (const pathItem of list) {
                        fs.mkdirSync(dirname(path.pathHtdocs + '/' + pathItem), { recursive: true })
                        fs.copyFileSync(pathItem, path.pathHtdocs + '/' + pathItem)
                    }
                }
            } else {
                fs.mkdirSync(dirname(pathParent), { recursive: true })
                fs.writeFileSync(pathParent, input, { encoding: 'utf-8' })
            }

        }

        // create folder default
        for (const p of config.createFolder) {
            fs.mkdirSync(path.pathHtdocs + '/' + p, { recursive: true })
        }

        // write .env file
        fs.writeFileSync(path.pathHtdocs + '/.env', getEnvContent(), { encoding: 'utf-8' })
        function getEnvContent() {
            const envMerge = { ...envConfig, ...hosting.env }
            let envContent = ''
            for (const envKey in envMerge) {
                envContent += `${envKey}=${envMerge[envKey]}\r\n`
            }
            return envContent
        }
    }

    function upload() {
        return new Promise((resolve, reject) => {
            const client = new ftp()

            client.on('ready', async function () {
                try {
                    log('   | clear htdocs ...')
                    await clearHtdocs()

                    log('   | upload zip to htdocs ....')
                    for (const file of listUpload) {
                        await pushFile(path.pathSplitZip + '/' + file, htdocsFolderServer + '/zips/' + file)
                    }

                    // file extract zip
                    await pushFile(config.indexFile, htdocsFolderServer + '/index.php')
                    await pushFile(config.extractFile, htdocsFolderServer + '/extract.php')
                    await pushFile(JSON.stringify({ excludeVendor: !Boolean(hasVendor), artisanCommand: artisanCommand }), htdocsFolderServer + '/config.json')
                    resolve()
                } catch (error) {
                    reject(error)
                    log(error)
                    console.log(error)
                    exit(1)
                }
            })

            client.connect(hosting.connection)

            async function clearHtdocs() {
                await new Promise((resolve, reject) => {
                    client.rmdir(htdocsFolderServer + '/zips', true, (err) => {
                        if (err && err.code !== 550) {
                            reject(err)
                        }
                        resolve()
                    })
                })
                await new Promise((resolve, reject) => {
                    client.mkdir(htdocsFolderServer + '/zips', true, (err) => {
                        if (err) {
                            reject(err)
                        }
                        resolve()
                    })
                })
                await new Promise((resolve, reject) => {
                    client.delete(htdocsFolderServer + '/.htaccess', (err) => {
                        if (err && err.code !== 550) {
                            reject(err)
                        }
                        resolve()
                    })
                })
            }

            function pushFile(input, path) {
                log('   | push file: ', path)
                return new Promise((resolve, reject) => {
                    client.put(input, path, (err) => {
                        if (err) {
                            log(err)
                            reject()
                        }
                        resolve()
                    })
                })
            }
        })
    }

    function cleanBuild() {
        if (fs.existsSync(path.pathZip)) fs.rmSync(path.pathZip)
        if (fs.existsSync(path.pathSplitZip)) fs.rmdirSync(path.pathSplitZip, { recursive: true })
        if (fs.existsSync(path.pathHtdocs)) fs.rmdirSync(path.pathHtdocs, { recursive: true })
    }




}

function log(...args) {
    console.log.apply(undefined, ['=> '.log, ...args.map(v => {
        if (typeof v === 'object') {
            return beautify(v, null, 2, 50).log
        } else if (typeof v === 'function') {
            return v.toString().log
        }
        return ('' + v).log
    })])
}