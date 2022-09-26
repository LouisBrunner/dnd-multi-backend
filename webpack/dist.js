const { merge } = require('webpack-merge');
const commonConfig = require('./core');

module.exports = merge(commonConfig, {
  entry: {
    DnDMultiBackend: './packages/dnd-multi-backend/src/index.ts',
    ReactDnDMultiBackend: './packages/react-dnd-multi-backend/src/index.ts',
    HTML5toTouch: './packages/rdndmb-html5-to-touch/src/index.ts',
    ReactDnDPreview: './packages/react-dnd-preview/src/index.ts',
  },
  output: {
    path: `${__dirname}/..`,
    filename: ({chunk}) => {
      let dir = '';
      if (chunk.name === 'DnDMultiBackend') {
        dir = 'dnd-multi-backend';
      } else if (chunk.name === 'ReactDnDMultiBackend') {
        dir = 'react-dnd-multi-backend';
      } else if (chunk.name === 'HTML5toTouch') {
        dir = 'rdndmb-html5-to-touch';
      } else if (chunk.name === 'ReactDnDPreview') {
        dir = 'react-dnd-preview';
      }
      return `packages/${dir}/dist/umd/[name].min.js`;
    },
    libraryTarget: 'umd',
    library: '[name]',
  },
  externals: [
    {
      // Use external version of React and ReactDnD
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dnd': 'ReactDnD',
    },
    // eslint-disable-next-line require-await, space-before-function-paren
    async ({context, request}) => {
      if (/\/rdndmb-html5-to-touch\//.test(context) && /^dnd-multi-backend$/.test(request)) {
        return 'DnDMultiBackend';
      }
      return undefined;
    },
  ],
});
