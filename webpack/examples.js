const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');
const path = require('path');

module.exports = webpackMerge(commonConfig(), {
  entry: './src/examples/index.js',
  output: {
    path: path.resolve('./examples'),
    filename: 'examples.min.js',
  },
});
