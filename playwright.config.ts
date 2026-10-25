import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './src/data/constants';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(isCI ? ([['github']] as const) : []),
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // SauceDemo uses data-test attributes instead of data-testid
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Logs in once and saves the session so UI tests start authenticated
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: '**/api/**',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: '**/api/**',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: '**/api/**',
    },

    // REST API tests (no browser needed)
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: process.env.API_BASE_URL ?? 'https://dummyjson.com' },
    },
  ],
});
