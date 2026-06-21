import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'npx next dev -p 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  globalSetup: require.resolve('./e2e/global-setup'),

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
