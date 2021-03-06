const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/core/index.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "vue.js",
    }
}