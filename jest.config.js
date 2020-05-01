module.exports = {
  notify: true,
  notifyMode: 'failure-success',

  collectCoverage: true,
  coverageReporters: process.env.CI ? ['lcov'] : ['text', 'text-summary', 'html'], // eslint-disable-line no-process-env
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
  ],

  projects: [
    {
      displayName: 'test',
      verbose: true,

      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

      moduleNameMapper: {
        '^dnd-multi-backend$': '<rootDir>/packages/dnd-multi-backend/src',
        '^react-dnd-preview$': '<rootDir>/packages/react-dnd-preview/src',
        '^dnd-core$': 'dnd-core/dist/cjs',
        '^react-dnd$': 'react-dnd/dist/cjs',
        '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
        '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
        '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
        '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
      },
    },
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/**/*.js'],
    },
  ],
};
