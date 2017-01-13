var webpack = require('webpack');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'ReactDnDMultiBackend.min.js',
    libraryTarget: 'umd',
    library: 'ReactDnDMultiBackend'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        "presets": ["es2015"],
        "plugins": [
          'lodash',
          "transform-decorators-legacy",
          "transform-class-properties"
        ]
      }
    }]
  },
  externals: {
    // Use external version of React and ReactDnD
    "react": "React",
    "react-dnd": "ReactDnD"
  },
  plugins: [
    new LodashModuleReplacementPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    }),
  ]
};
