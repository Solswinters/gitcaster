const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mappings for layered architecture
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },
  
  testEnvironment: 'jest-environment-jsdom',
  
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{ts,tsx}', // Barrel exports
    '!src/app/**/page.tsx', // Next.js pages (tested via E2E)
    '!src/app/**/layout.tsx', // Next.js layouts (tested via E2E)
  ],
  
  // Coverage thresholds by directory
  coverageThresholds: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    // Domain layer should have highest coverage (business logic)
    './src/domain/**/*.{ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Application services need good coverage
    './src/application/**/*.{ts,tsx}': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Shared utilities should be well tested
    './src/shared/utils/**/*.{ts,tsx}': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  
  // Test path patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx}',
    '<rootDir>/tests/**/*.spec.{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
  ],
  
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/', // E2E tests run separately
  ],
  
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  
  // Global setup/teardown
  globalSetup: '<rootDir>/tests/setup/global-setup.ts',
  globalTeardown: '<rootDir>/tests/setup/global-teardown.ts',
  
  // Mock settings
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
