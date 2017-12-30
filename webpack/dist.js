const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: {
    'dnd-multi-backend': './packages/dnd-multi-backend/src/index.js',
    'examples_dnd-multi-backend': './packages/dnd-multi-backend/examples/index.js',
    ReactDnDMultiBackend: './packages/react-dnd-multi-backend/src/index.js',
    RDMBHTML5toTouch: './packages/react-dnd-multi-backend/src/HTML5toTouch.js',
    'examples_react-dnd-multi-backend': './packages/react-dnd-multi-backend/examples/index.js',
    'react-dnd-preview': './packages/react-dnd-preview/src/index.js',
    'examples_react-dnd-preview': './packages/react-dnd-preview/examples/index.js',
  },
  output: {
    path: `${__dirname}/../dist`,
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: '[name]',
  },
  externals: {
    // Use external version of React and ReactDnD
    react: 'React',
    'react-dnd': 'ReactDnD',
  },
});
