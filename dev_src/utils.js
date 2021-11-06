const colors = require('colors')
const { exit } = require('process')
const beautify = require('json-beautify')
const concurrently = require('concurrently')

colors.setTheme({ log: ['yellow', 'bold'] })

class Args {
    constructor() {
        const args = process.argv.slice(3, process.argv.length)
        this.mapArgs = {}
        const mapArgs = this.mapArgs
        this.command = process.argv[2]

        if (!args) return
        let propertyCount = -1
        let propertyName
        for (const arg of args) {
            if (arg[0] + arg[1] === '--') {
                propertyCount = 0
                propertyName = arg.slice(2, arg.length)
                mapArgs[propertyName] = [true]
            } else {
                if (!propertyName) {
                    log('Wrong syntax')
                    log(config.helpText)
                    exit()
                } else {
                    if (propertyCount === 0) {
                        mapArgs[propertyName] = [arg]
                    } else if (propertyCount === 1) {
                        mapArgs[propertyName] = [mapArgs[propertyName], arg]
                    } else {
                        mapArgs[propertyName].push(arg)
                    }
                    ++propertyCount
                }
            }
        }

        this.get = this.get.bind(this)
        this.getOne = this.getOne.bind(this)
    }
    getOne(key, defaultValue, condition = (value) => true) {
        const result = this.get(key)[0]
        return condition(result)
            ? result
            : defaultValue
    }
    get(key) {
        return this.mapArgs[key] || []
    }
}


const utils = {
    log(...args) {
        console.log.apply(undefined, ['=> '.log, ...args.map(v => {
            if (typeof v === 'object') {
                return beautify(v, null, 2, 50).log
            } else if (typeof v === 'function') {
                return v.toString().log
            }
            return ('' + v).log
        })])
    },
    args: new Args(),
    async splitZipFile(file, destFolder, maxSize = 1) {
        fs.rmdirSync(destFolder, { recursive: true })
        fs.mkdirSync(destFolder, { recursive: true })
        const size = Number.parseInt(1024 * 1024 * maxSize)

        await concurrently([`zipsplit -n ${size} -b ${destFolder} ${file}`], {

        })
        return fs.readdirSync(destFolder)
    }
}


module.exports = utils