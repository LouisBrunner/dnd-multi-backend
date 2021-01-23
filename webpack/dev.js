const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const examplesConfig = require('./examples');

module.exports = merge(examplesConfig, {
  devtool: 'eval-cheap-module-source-map',
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
