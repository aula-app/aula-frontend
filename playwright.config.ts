import { defineConfig, devices } from '@playwright/test';

// Shared Chrome options — applied to every project via the global `use` block.
// Project-level `use: { ...devices['Desktop Chrome'] }` merges on top (adds viewport/UA).
export default defineConfig({
  testDir: './tests',
  // single test timeout (base.describe.serial -> **test** -> test.step)
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
    trace: 'on', //'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

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
  // See docker-compose.e2e.yml for more info
  workers: 3,

  projects: [
    // ── 1. instance-offline ────────────────────────────────────────────────────
    // Flips a global instance flag that breaks every other test while active.
    // Must finish before anything else starts.
    // @TODO: i think this can also run in parallel now with full DB isolation
    {
      name: 'offline',
      testDir: './tests/specs/offline',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
    },

    // ── 2. core (parallel) ────────────────────────────────────────────────────
    // All remaining core specs. Each worker has its own DB, and reseeds it for each test case.
    {
      name: 'core',
      testDir: './tests/specs/core',
      testIgnore: ['**/disabled/**'],
      use: { ...devices['Desktop Chrome'] },
      workers: 3,
    },

    // ── 4. admin ──────────────────────────────────────────────────────────────
    // Admin-only specs that modify global configuration — run after core.
    // @TODO: i think this can also run in parallel now with full DB isolation
    {
      name: 'admin',
      testDir: './tests/specs/admin',
      testIgnore: '**/disabled/**',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
      dependencies: ['core'],
    },

    // ── 5. v2 ─────────────────────────────────────────────────────────────────
    // V2 UI specs — no auth required for public routes (login page, etc.)
    {
      name: 'v2',
      testDir: './tests/specs/v2',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
    },
  ],
});
