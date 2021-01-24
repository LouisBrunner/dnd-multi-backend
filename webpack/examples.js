const { merge } = require('webpack-merge');
const commonConfig = require('./core');

module.exports = merge(commonConfig, {
  entry: {
    'dnd-multi-backend': './packages/dnd-multi-backend/examples/index.js',
    'react-dnd-multi-backend': './packages/react-dnd-multi-backend/examples/index.js',
    'react-dnd-preview_main': './packages/react-dnd-preview/examples/main/index.js',
    'react-dnd-preview_offset': './packages/react-dnd-preview/examples/offset/index.js',
  },
  output: {
    path: `${__dirname}/../examples`,
    filename: 'examples_[name].min.js',
  },
});
