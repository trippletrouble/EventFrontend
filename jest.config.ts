import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // Setup: jest-axe global + MSW Server Lifecycle
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],

  // Was testen
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/__tests__/**/*.test.{ts,tsx}',
  ],

  // Coverage — starten bei 0%, wird graduell erhöht
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
    '!src/app/**/layout.tsx',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],

  // Module-Aliase (matching tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Reporter für GitLab CI
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
      suiteName: 'Unternehmerbörse Frontend Tests',
    }],
  ],
};

const jestConfig = async () => {
  const resolvedConfig = await createJestConfig(config)();
  resolvedConfig.transformIgnorePatterns = [
    'node_modules/(?!(rettime|msw|@mswjs/interceptors|until-async|@open-draft|strict-event-emitter|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return resolvedConfig;
};

export default jestConfig;
