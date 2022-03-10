module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['node_modules/', 'build/', 'examples/'],
  rootDir: 'src',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  testTimeout: 45000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
