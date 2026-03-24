import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 5_000,
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

    // Performance: Only keep traces/screenshots on failure
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    actionTimeout: 10_000,
    navigationTimeout: 10_000,

    launchOptions: {
      args: [
        '--disable-gl-drawing-for-tests',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-networking',
        '--mute-audio',
      ],
    },
  },

  // Retry failed tests (helps with flakiness)
  retries: process.env.CI ? 2 : 1,
  globalSetup: './tests/lifecycle/setup-auth.ts',
  globalTeardown: './tests/lifecycle/teardown-auth.ts',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'core',
      testDir: './tests/specs/core',
      testIgnore: '**/disabled/**',
      use: { ...devices['Desktop Chrome'] },
      workers: 1, // note - someday these can be run in parallel after https://github.com/aula-app/aula-frontend/issues/604
    },
    // these tests must run at the end because they interfere
    // with the previous tests:
    {
      name: 'admin',
      testDir: './tests/specs/admin',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['core'],
      workers: 1,
    },
  ],
});
