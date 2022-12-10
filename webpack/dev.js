const path = require('path');
const {merge} = require('webpack-merge');
const examplesConfig = require('./examples');

module.exports = merge(examplesConfig, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  devServer: {
    port: 4001,
    static: {
      directory: path.join(__dirname, '..', 'examples'),
    },
    hot: true,
  },
});
