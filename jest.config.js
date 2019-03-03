const glob = require('glob');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  coverageReporters: process.env.CI ? ['lcov'] : ['text', 'text-summary', 'html'], // eslint-disable-line no-process-env
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
  ],
  verbose: true,
  notify: true,
  notifyMode: 'failure-success',
  modulePaths: glob.sync('packages/*/node_modules').map((path) => {
    return `<rootDir>/${path}`;
  }),
};
