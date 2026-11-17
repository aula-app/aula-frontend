import { defineConfig, devices } from '@playwright/test';

// Shared Chrome options — applied to every project via the global `use` block.
// Project-level `use: { ...devices['Desktop Chrome'] }` merges on top (adds viewport/UA).
export default defineConfig({
  testDir: './tests',
  // single test timeout (base.describe.serial -> **test** -> test.step)
  // quite large due to some tests having many steps
  timeout: 180_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['html', { outputFolder: 'tests/reports/playwright-report' }]],

  /* Configure output directories */
  outputDir: 'tests/results',

  use: {
    // Performance: Only keep traces/screenshots on failure
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    reducedMotion: 'reduce',
    actionTimeout: 15_000,
    navigationTimeout: 15_000,

    launchOptions: {
      args: [
        // linux needs GL drawing
        // '--disable-gl-drawing-for-tests',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-background-networking',
        '--disable-accelerated-2d-canvas',
        '--disable-renderer-backgrounding',
        '--memory-pressure-off',
        '--mute-audio',
      ],
    },
  },

  retries: process.env.CI ? 2 : 1,
  globalSetup: './tests/lifecycle/setup-auth.ts',
  globalTeardown: './tests/lifecycle/teardown-auth.ts',

  // Set a global maximum of workers so that we initialize DB with correct amount of tenants
  // See docker-compose.e2e.yml (backend-setup) for more info
  workers: 3,

  projects: [
    {
      name: 'all',
      testDir: './tests/specs',
      testIgnore: ['**/disabled/**'],
      use: { ...devices['Desktop Chrome'] },
      workers: 3,
    },
  ],
});
