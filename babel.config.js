const generatePresets = ({ modules } = {}) => {
  return [
    ['@babel/preset-env', {
      modules,
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
  // eslint-disable-next-line no-process-env
  presets: generatePresets({ modules: process.env.CJS === 'yes' ? 'commonjs' : false }),
  env: {
    test: {
      presets: generatePresets({ modules: 'commonjs' }),
    },
  },
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
