const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const examplesConfig = require('./examples.js');

module.exports = webpackMerge(examplesConfig, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  devServer: {
    port: 4001,
    contentBase: path.join(__dirname, '..', 'examples'),
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
