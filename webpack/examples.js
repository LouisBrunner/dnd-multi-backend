const { merge } = require('webpack-merge');
const commonConfig = require('./core');

module.exports = merge(commonConfig, {
  entry: {
    'dnd-multi-backend': './packages/dnd-multi-backend/examples/index.ts',
    'react-dnd-multi-backend': './packages/react-dnd-multi-backend/examples/index.tsx',
    'react-dnd-preview_main': './packages/react-dnd-preview/examples/main/index.tsx',
    'react-dnd-preview_offset': './packages/react-dnd-preview/examples/offset/index.tsx',
  },
  output: {
    path: `${__dirname}/../examples`,
    filename: 'examples_[name].min.js',
  },
});
