import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true, // this is disablef below
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  // retries are off because this messes with mutations in the tests
  //retries: process.env.CI ? 2 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },
  globalSetup: './tests/mutating/setup-auth.ts',
  globalTeardown: './tests/mutating/teardown-auth.ts',
  expect: {
    timeout: 5000,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'main',
      testDir: './tests/mutating/main',
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

    /*     {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['tests/mutating/**'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['tests/mutating/**'],
    }, */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
