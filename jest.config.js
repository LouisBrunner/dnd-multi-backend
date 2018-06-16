module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/tests/setup.js",
  collectCoverage: true,
  coverageReporters: process.env.CI ? ["lcov"] : ["text", "text-summary", "html"],
  collectCoverageFrom: [
    "packages/*/src/**/*.js",
  ],
};
