const dev = require('./webpack.dev');
module.exports = {
    ...dev,
    watch: false,
    devtool: undefined
}