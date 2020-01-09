var nodeExternals = require("webpack-node-externals")
const path = require('path');

module.exports = {
    entry: './index.js',
    target: 'node',
    mode: 'development',
    externals: nodeExternals(),
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'dist.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    }
}