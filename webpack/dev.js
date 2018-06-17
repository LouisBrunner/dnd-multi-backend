const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const examplesConfig = require('./examples.js');

module.exports = webpackMerge(examplesConfig, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  serve: {
    port: 4001,
    content: './dev',
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
