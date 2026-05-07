const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: [],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mejoy/domain$': '<rootDir>/packages/domain/src/index.ts',
    '^@mejoy/domain/(.*)$': '<rootDir>/packages/domain/src/$1',
    '^@mejoy/api-contracts$': '<rootDir>/packages/api-contracts/src/index.ts',
    '^@mejoy/api-contracts/(.*)$': '<rootDir>/packages/api-contracts/src/$1',
    '^@mejoy/design-tokens$': '<rootDir>/packages/design-tokens/src/index.ts',
    '^@mejoy/design-tokens/(.*)$': '<rootDir>/packages/design-tokens/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
