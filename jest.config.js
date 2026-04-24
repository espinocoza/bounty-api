module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom": [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper": {
    '^@src/(.*)$': '<rootDir>/$1',
    '^@schemas/(.*)$': '<rootDir>/schemas/$1',
    '^@dtos/(.*)$': '<rootDir>/dtos/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
  },
};
