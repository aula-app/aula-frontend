import { defineConfig, devices } from '@playwright/test';

// Shared Chrome options — applied to every project via the global `use` block.
// Project-level `use: { ...devices['Desktop Chrome'] }` merges on top (adds viewport/UA).
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
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

  retries: process.env.CI ? 2 : 1,
  globalSetup: './tests/lifecycle/setup-auth.ts',
  globalTeardown: './tests/lifecycle/teardown-auth.ts',

  projects: [
    // ── 1. instance-offline ────────────────────────────────────────────────────
    // Flips a global instance flag that breaks every other test while active.
    // Must finish before anything else starts.
    {
      name: 'offline',
      testDir: './tests/specs/core',
      testMatch: '**/instance-offline.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
    },

    // ── 2. core (parallel) ────────────────────────────────────────────────────
    // All remaining core specs. Each file uses uniquely-hashed entity names so
    // workers don't clash in the database.
    // CI uses fewer workers to avoid overwhelming the backend.
    {
      name: 'core',
      testDir: './tests/specs/core',
      testIgnore: ['**/disabled/**', '**/instance-offline.spec.ts', '**/rooms-search-and-sort.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
      workers: process.env.CI ? 2 : 4,
      dependencies: ['offline'],
    },

    // ── 3. search-sort ────────────────────────────────────────────────────────
    // Runs after core so it operates on a stable room list.
    // Seeds its own room in beforeAll for deterministic assertions.
    {
      name: 'search-sort',
      testDir: './tests/specs/core',
      testMatch: '**/rooms-search-and-sort.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
      dependencies: ['core'],
    },

    // ── 4. admin ──────────────────────────────────────────────────────────────
    // Admin-only specs that modify global configuration — run after core.
    {
      name: 'admin',
      testDir: './tests/specs/admin',
      testIgnore: '**/disabled/**',
      use: { ...devices['Desktop Chrome'] },
      workers: 1,
      dependencies: ['core'],
    },
  ],
});
