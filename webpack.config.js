const nodeExternals = require('webpack-node-externals');
const path = require('path');

const configs = {
  entry: './index.js',
  target: 'node',
  mode: process.env.NODE_ENV,
  externals: nodeExternals(),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundled.js',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /(node_modules)/,
        test: /\.js$/,
      },
    ],
  },
};

if (process.env.NODE_ENV !== 'production') {
  configs.devtool = 'source-map';
}

module.exports = configs;
