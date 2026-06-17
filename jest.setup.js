// Provide a valid env so src/env.ts module-level parse succeeds during tests.
// Individual tests exercise envSchema directly with their own inputs.
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4010'