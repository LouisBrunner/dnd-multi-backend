const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: './src/examples/index.js',
  output: {
    path: `${__dirname}/../dist`,
    filename: 'examples.min.js',
  },
  externals: {
    // Use external version of React, ReactDnD, MultiBackend and HTML5toTouch
    react: 'React',
    'react-dnd': 'ReactDnD',
    'lib/index.js': 'ReactDnDMultiBackend',
    'lib/HTML5toTouch.js': 'RDMBHTML5toTouch',
  },
});
