const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: './src/examples/index.js',
  output: {
    path: './examples',
    filename: 'examples.min.js'
  },
});
