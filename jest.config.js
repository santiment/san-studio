module.exports = {
  transform: { '.ts': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '\\.(test)\\.(ts|js)',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^webkit/(.*)$': '<rootDir>/node_modules/san-webkit/lib/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!san-webkit)/'],
}
