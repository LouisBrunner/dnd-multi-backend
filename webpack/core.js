const glob = require('glob');

module.exports = function wpConfig() {
  return {
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
};
