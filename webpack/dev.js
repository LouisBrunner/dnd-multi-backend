const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const examplesConfig = require('./examples');

const resolveAlias = {};
for (const pkg of ['dnd-multi-backend', 'react-dnd-multi-backend', 'react-dnd-preview']) {
  resolveAlias[pkg] = path.resolve(__dirname, '..', 'packages', pkg, 'src');
}

module.exports = webpackMerge(examplesConfig, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  devServer: {
    port: 4001,
    contentBase: path.join(__dirname, '..', 'examples'),
    hot: true,
  },
  resolve: {
    alias: resolveAlias,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
