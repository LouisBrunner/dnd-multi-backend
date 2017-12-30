const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: {
    DnDMultiBackend: './packages/dnd-multi-backend/src/index.js',
    ReactDnDMultiBackend: './packages/react-dnd-multi-backend/src/index.js',
    RDMBHTML5toTouch: './packages/react-dnd-multi-backend/src/HTML5toTouch.js',
    examples_agnostic: './packages/dnd-multi-backend/examples/index.js',
    examples_react: './packages/react-dnd-multi-backend/examples/index.js',
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
