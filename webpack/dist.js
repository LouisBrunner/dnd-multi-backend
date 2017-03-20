const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: {
    ReactDnDMultiBackend: './src/lib/index.js',
    RDMBHTML5toTouch: './src/lib/HTML5toTouch.js',
  },
  output: {
    path: './dist',
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  externals: {
    // Use external version of React and ReactDnD
    'react': 'React',
    'react-dnd': 'ReactDnD',
  },
});
