const glob = require('glob');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {loader: 'babel-loader'},
          {loader: 'eslint-loader'},
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {loader: 'ts-loader'},
          {loader: 'eslint-loader'},
        ],
      },
    ],
  },
  resolve: {
    modules: ['.', './node_modules'].concat(glob.sync('packages/*/node_modules')),
  },
};
