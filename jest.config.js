const {defaults} = require('jest-config');

module.exports = {
  notify: true,
  notifyMode: 'failure-success',

  collectCoverage: true,
  coverageReporters: process.env.CI ? ['lcov'] : ['text', 'text-summary', 'html'], // eslint-disable-line no-process-env
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    '!**/__fixtures__/**/*',
  ],

  projects: [
    {
      displayName: 'test',

      testEnvironment: 'jsdom',

      setupFilesAfterEnv: [
        '@testing-library/jest-dom',
      ],

      moduleNameMapper: {
        '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
        '^dnd-multi-backend$': '<rootDir>/packages/dnd-multi-backend/src',
        '^react-dnd-preview$': '<rootDir>/packages/react-dnd-preview/src',
      },

      moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    },
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testRegex: [
        '/.*\\.[jt]sx?$',
      ],
    },
  ],
};
