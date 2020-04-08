// Coverage only shows for Vue components that have data, methods, or computed properties
// See https://github.com/vuejs/vue-cli/issues/1879#issuecomment-412300256

module.exports = {
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  testEnvironment: 'node',
  automock: false,

  reporters: ['default'],

  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['lcov', 'json-summary', 'html', 'text', 'text-summary'],
  coverageDirectory: '<rootDir>/test-reports/coverage',
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
