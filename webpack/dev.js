const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const examplesConfig = require('./examples.js');

module.exports = webpackMerge(examplesConfig, {
  devtool: 'cheap-module-eval-source-map',
  output: {
    pathinfo: true,
  },
  devServer: {
    port: 4001,
    compress: true,
    contentBase: './docs',
    hot: true,
    stats: {
      cached: false,
      cachedAssets: false,
      colors: true,
      exclude: ['node_modules'],
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
