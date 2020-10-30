const glob = require('glob');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  resolve: {
    modules: ['.', './node_modules'].concat(glob.sync('packages/*/node_modules')),
  },
};
