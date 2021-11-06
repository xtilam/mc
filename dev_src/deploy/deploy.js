const fs = require('fs')
const config = require('./config')
const { args: { get: args, getOne: arg }, log, splitZipFile } = require('../utils')
const zip = require('zip-a-folder')
const { exit } = require('process')

class Deploy {

    constructor() {

        this.publicPath = './builds'
        this.hosting = config.hosting[arg('hosting', 1, (v) => config.hosting[v])]


        this.paths = {
            pathZip: this.publicPath + '/htdocs.zip',
            pathSplitZip: this.publicPath + '/htdocs_split',
            htdocsPath: this.publicPath + '/htdocs',
        }

        this.hasVendor = arg('vendor', true)
        this.publicPathServer = this.hosting.publicPath || 'htdocs'
        this.zipSizeSplit = Number.parseFloat(arg('zip-split-size', 2))
        this.artisanCommand = args('artisan')

        if (arg('fresh-database')) {
            this.artisanCommand.push('migrate:fresh --force')
        } else {
            this.artisanCommand.push('migrate --force')
        }

        this.cleanBuild()

        fs.mkdirSync(this.publicPath)


    }

    cleanBuild() {
        log('clean build ...')
        if (fs.existsSync(this.publicPath)) fs.rmdirSync(this.publicPath, { recursive: true })
    }

    buildFontEnd() {
        log('build font-end')
        return concurrently([`npm run-script build`])
    }

    copyFiles() {
        log('copy file ...')
        const { htdocsPath } = this.paths

        // copy file from config
        for (const item of config.listFileCopy) {
            let input = item.content || item.path
            if (!input) continue

            const pathParent = htdocsPath + '/' + item.path

            if (fs.existsSync(input)) {
                let list = getListPath(input, item.exclude || [])
                if (list.length <= 1) {
                    if (list[0]) {
                        fs.mkdirSync(dirname(pathParent), { recursive: true })
                        fs.copyFileSync(list[0], htdocsPath + '/' + item.path)
                    }
                } else {
                    for (const pathItem of list) {
                        fs.mkdirSync(dirname(htdocsPath + '/' + pathItem), { recursive: true })
                        fs.copyFileSync(pathItem, htdocsPath + '/' + pathItem)
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

        /**  functions ==========================================================*/
        function getListPath(path, exclude = []) {
            let listPath = []
            if (exclude.length > 0) {
                exclude = exclude.map((value) => {
                    return path + '/' + value
                })
            }

            search(path)
            return listPath

            function search(path, filename) {
                let currentPath = path
                if (fs.existsSync(currentPath)) {
                    const stat = fs.lstatSync('./' + currentPath)
                    if (!stat.isDirectory()) {
                        if (filename !== '.gitignore' && exclude.findIndex(path => currentPath === path) === -1) listPath.push(currentPath)
                    } else {
                        const listFile = fs.readdirSync(path)
                        for (const fileName of listFile) {
                            search(currentPath + '/' + fileName, fileName)
                        }
                    }
                }
            }
        }
    }
    writeEnvFile() {
        log('write enviroment file')

        // write .env file
        fs.writeFileSync(path.pathHtdocs + '/.env', getEnvContent(), { encoding: 'utf-8' })
        function getEnvContent() {
            const envMerge = { ...config.envConfig, ...this.hosting.env }
            let envContent = ''
            for (const envKey in envMerge) {
                envContent += `${envKey}=${envMerge[envKey]}\r\n`
            }
            return envContent
        }
    }
    vendorInstall() {
        if (hasVendor) {
            log('vendor install ...')
            return concurrently([`cd ${fs.realpathSync(path.pathHtdocs)} && composer install --no-dev --optimize-autoloader`])
        }
    }
    uploadFTP() {
        log('upload ftp')
        const { pathSplitZip, pathZip } = this.paths

        return new Promise((resolve, reject) => {
            const client = new ftp()

            client.on('ready', async () => {
                try {
                    log('   | clear public folder ...' + this.publicPathServer)
                    await clearPublicFolder()

                    log('   | upload zip to public folder ....')
                    for (const file of listUpload) {
                        await pushFile(pathSplitZip + '/' + file, this.publicPathServer + '/zips/' + file)
                    }

                    // file extract zip
                    await pushFile(config.indexFile, this.publicPathServer + '/index.php')
                    await pushFile(config.extractFile, this.publicPathServer + '/extract.php')
                    await pushFile(JSON.stringify({ excludeVendor: !Boolean(this.hasVendor), artisanCommand: this.artisanCommand }), this.publicPathServer + '/config.json')
                    resolve()
                } catch (error) {
                    reject(error)
                    log(error)
                    console.log(error)
                    exit(1)
                }
            })

            client.connect(this.hosting.connection)

            const clearPublicFolder = async () => {
                await new Promise((resolve, reject) => {
                    client.rmdir(this.publicPathServer + '/zips', true, (err) => {
                        if (err && err.code !== 550) {
                            reject(err)
                        }
                        resolve()
                    })
                })
                await new Promise((resolve, reject) => {
                    client.mkdir(this.publicPathServer + '/zips', true, (err) => {
                        if (err) {
                            reject(err)
                        }
                        resolve()
                    })
                })
                await new Promise((resolve, reject) => {
                    client.delete(this.publicPathServer + '/.htaccess', (err) => {
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
    buildZip() {
        log('build zip ...')
        const { pathHtdocs, pathZip } = this.paths
        zip(pathHtdocs, pathZip)
    }
    splitZip() {
        log('split zip')
        const { pathZip, pathSplitZip } = this.paths
        splitZipFile(pathZip, pathSplitZip, this.zipSizeSplit)
    }
    openURL() {
        return open(this.hosting.env.APP_URL)
    }
}

module.exports = Deploy