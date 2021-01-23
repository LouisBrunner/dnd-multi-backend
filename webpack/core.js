const glob = require('glob');
const path = require('path');

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
          {loader: 'babel-loader'},
          {loader: 'ts-loader', options: {
            configFile: path.join(__dirname, '..', 'tsconfig.webpack.json'),
          }},
          {loader: 'eslint-loader'},
        ],
      },
    ],
  },
  resolve: {
    modules: ['.', './node_modules'].concat(glob.sync('packages/*/node_modules')),
    extensions: ['.wasm', '.tsx', '.ts', '.mjs', '.js', '.json'],
  },
};
