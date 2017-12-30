const webpackMerge = require('webpack-merge');
const commonConfig = require('./core.js');

module.exports = webpackMerge(commonConfig(), {
  entry: {
    agnostic: './packages/dnd-multi-backend/examples/index.js',
    react: './packages/react-dnd-multi-backend/examples/index.js',
  },
  output: {
    path: `${__dirname}/../docs`,
    filename: 'examples_[name].min.js',
  },
});
