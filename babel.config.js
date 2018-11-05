const generatePresets = ({modules} = {}) => {
  return [
    ['@babel/preset-env', {
      modules: modules ? 'commonjs' : false,
      targets: {
        browsers: [
          '> 1%',
          'last 2 versions',
        ],
      },
      debug: true,
    }],
    '@babel/preset-react',
  ];
};

module.exports = {
  presets: generatePresets({modules: false}),
  env: {
    test: {
      presets: generatePresets({modules: true}),
    },
  },
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
  ],
};
