const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: './src/lib/index.js',
  output: {
    path: './dist',
    filename: 'ReactDnDMultiBackend.min.js',
    libraryTarget: 'umd',
    library: 'ReactDnDMultiBackend'
  },
  externals: {
    // Use external version of React and ReactDnD
    'react': 'React',
    'react-dnd': 'ReactDnD'
  },
});
