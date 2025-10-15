import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0, // retries are off because this messes with mutations in the tests
  reporter: [['html', { outputFolder: 'tests/reports/playwright-report' }]], //Reporter to use. See https://playwright.dev/docs/test-reporters

  /* Configure output directories */
  outputDir: 'tests/results',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // baseURL: 'http://127.0.0.1:3000',
    trace: 'on',
  },
  globalSetup: './tests/mutating/setup-auth.ts',
  globalTeardown: './tests/mutating/teardown-auth.ts',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'main',
      testDir: './tests/mutating/main',
      testIgnore: '**/not_Working/**',
      use: { ...devices['Desktop Chrome'] },
      workers: 1, // note - someday these can be run in parallel after https://github.com/aula-app/aula-frontend/issues/604
    },
    // these tests must run at the end because they interfere
    // with the previous tests:
    {
      name: 'after',
      testDir: './tests/mutating/after',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['main'],
      workers: 1,
    },
  ],
});
