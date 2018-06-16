module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/tests/setup.js', // eslint-disable-line id-length
  collectCoverage: true,
  coverageReporters: process.env.CI ? ['lcov'] : ['text', 'text-summary', 'html'], // eslint-disable-line no-process-env
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
  ],
};
