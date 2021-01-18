const { merge } = require('webpack-merge');
const commonConfig = require('./core');

module.exports = merge(commonConfig, {
  entry: {
    'dnd-multi-backend': './packages/dnd-multi-backend/src/index.ts',
    'react-dnd-multi-backend': './packages/react-dnd-multi-backend/src/index.js',
    HTML5toTouch: './packages/react-dnd-multi-backend/src/HTML5toTouch.js',
    'react-dnd-preview': './packages/react-dnd-preview/src/index.ts',
  },
  output: {
    path: `${__dirname}/..`,
    filename: (chunkData) => {
      let dir = '[name]';
      if (chunkData.chunk.name === 'HTML5toTouch') {
        dir = 'react-dnd-multi-backend';
      }
      return `packages/${dir}/dist/umd/[name].min.js`;
    },
    libraryTarget: 'umd',
    library: '[name]',
  },
  externals: {
    // Use external version of React and ReactDnD
    react: 'React',
    'react-dnd': 'ReactDnD',
  },
});
