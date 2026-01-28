const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.tsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/__tests__/(.*)$': '<rootDir>/__tests__/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/__tests__/setup.tsx',
    '<rootDir>/__tests__/utils/',
    '<rootDir>/__tests__/mocks/',
    '<rootDir>/e2e/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/*.tsx', // Next.js pages are hard to test in isolation
    '!src/**/index.ts',
    '!src/lib/api/client.ts', // API client requires fetch mocking
    '!src/lib/api/config.ts', // Configuration file
    '!src/lib/query/queryClient.ts', // Query client configuration
    '!src/lib/query/QueryProvider.tsx', // Provider wrapper
    '!src/lib/store/StoreProvider.tsx', // Provider wrapper
    '!src/hooks/useNFT.ts', // Thin wrapper around React Query
    '!src/hooks/useNFTs.ts', // Thin wrapper around React Query
    '!src/lib/query/options/nftOptions.ts', // Query options configuration
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
