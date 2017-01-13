const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = webpackMerge(commonConfig(), {
  entry: './src/examples/index.js',
  output: {
    path: './examples',
    filename: 'examples.min.js'
  },
  babel: {
    'presets': ['es2015', 'react'],
    "plugins": [
      "lodash",
      "transform-decorators-legacy",
      "transform-class-properties"
    ],
  },
});
