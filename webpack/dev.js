const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const examplesConfig = require('./examples');

const resolveAlias = {};
for (const pkg of ['dnd-multi-backend', 'react-dnd-multi-backend', 'react-dnd-preview']) {
  resolveAlias[pkg] = path.resolve(__dirname, '..', 'packages', pkg, 'src');
}

module.exports = merge(examplesConfig, {
  devtool: 'eval-cheap-module-source-map',
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
