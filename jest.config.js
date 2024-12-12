import {defaults} from 'jest-config'

export default {
  notify: true,
  notifyMode: 'failure-success',

  collectCoverage: true,
  coverageReporters: process.env.CI ? ['lcov'] : ['text', 'text-summary', 'html'],
  collectCoverageFrom: ['packages/*/src/**/*.{js,jsx,ts,tsx}'],

  projects: [
    {
      displayName: 'test',

      testEnvironment: 'jsdom',

      setupFilesAfterEnv: ['<rootDir>/.jest-setup.ts'],

      transform: {
        '^.+\\.[jt]sx?$': ['esbuild-jest', {sourcemap: true}],
      },
      transformIgnorePatterns: ['/node_modules/(?!(dnd-core|@?react-dnd.*)/)'],
      moduleNameMapper: {
        '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
      },

      moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    },
  ],
}
