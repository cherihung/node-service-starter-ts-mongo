const nodeExternals = require('webpack-node-externals');
const path = require('path');

const configs = {
  entry: './index.ts',
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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

if (process.env.NODE_ENV !== 'production') {
  configs.devtool = 'inline-source-map';
}

module.exports = configs;
