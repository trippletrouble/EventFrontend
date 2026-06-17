/** @type {import('jest').Config} */
const config = {
  passWithNoTests: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
}

module.exports = config