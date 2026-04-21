// Global setup for Playwright tests
// Called once before all tests run

import * as fs from 'fs';
import * as path from 'path';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as userInteractions from '../interactions/users';
import * as apiUsers from '../helpers/api-users';
import * as entities from '../helpers/entities';
import * as shared from '../support/utils';
import { admin } from '../fixtures/user.fixture';
import { FILTER_EXCLUDED_RESOURCES } from '../fixtures/browser.fixture';
import { cleanupAllTestData } from './cleanup';

export default async function globalSetup() {
  console.log('🚀 Starting global setup...');

  // Purge any auth-states left over from a previously crashed run.
  // Without this, stale user-meta-*.json files cause the fixture's in-memory
  // userCache to load users whose backend state (e.g. changed passwords) no
  // longer matches what the cache records — making serial tests flaky.
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  if (fs.existsSync(authStatesDir)) {
    for (const file of fs.readdirSync(authStatesDir)) {
      fs.unlinkSync(path.join(authStatesDir, file));
    }
    console.log('🧹 Cleared stale auth-states from previous run');
  } else {
    fs.mkdirSync(authStatesDir, { recursive: true });
  }

  // Create a new run-id for this test run
  createNewRunId();

  // Launch browser and authenticate admin
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    if (process.env.REMOTE_BROWSER === '1') {
      browser = await chromium.connect(process.env.PW_TEST_CONNECT_WS_ENDPOINT);
    } else {
      browser = await chromium.launch({
        args: [
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-accelerated-2d-canvas',
          '--disable-renderer-backgrounding',
          '--memory-pressure-off',
          // '--max-old-space-size=12000',
        ],
      });
    }
    context = await browser.newContext();
    page = await context.newPage();
    await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

    // Log in admin
    await userInteractions.login(page, admin);

    // Verify token exists before saving
    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('❌ Setup failed: Admin login did not save token to localStorage');
    }

    console.log('✅ Admin logged in with token');

    // Scrub any test data left in the DB from a previously crashed run.
    // globalTeardown only runs when the process exits cleanly; if it was killed
    // mid-run, orphaned test-* entities accumulate and cause flaky failures.
    console.log('🧹 Scrubbing leftover test data from previous run...');
    await cleanupAllTestData(page);

    // Ensure instance is online
    await ensureInstanceOnline(page);

    // Save admin authentication state
    const adminStatePath = path.join(authStatesDir, 'admin-context.json');
    await context.storageState({ path: adminStatePath });
    console.log(`✅ Admin state saved to ${adminStatePath}`);

    // Pre-create shared test users so parallel workers all read from disk cache
    // instead of racing to create the same users with different hashes.
    await preCreateSharedUsers(browser, page, authStatesDir);

    console.log('✅ Global setup complete');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    // Cleanup
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

/**
 * Create a new run-id for this test run
 */
function createNewRunId(): void {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  const runIdFilePath = path.join(authStatesDir, 'run-id.txt');

  // Ensure directory exists
  if (!fs.existsSync(authStatesDir)) {
    fs.mkdirSync(authStatesDir, { recursive: true });
  }

  // Create new run-id
  const timestamp = new Date().getTime().toString();
  const newRunId = 'run-id-' + timestamp;
  fs.writeFileSync(runIdFilePath, newRunId, 'utf-8');

  console.log(`✅ Created new run-id: ${newRunId}`);
}

/**
 * Ensure instance is online before running tests
 */
async function ensureInstanceOnline(page: Page): Promise<void> {
  try {
    // Check if instance is online using the API
    const isOnline = await page.evaluate(async () => {
      const response = await fetch(`${localStorage.getItem('api_url')}/api/controllers/model.php?getInstanceSettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'aula-instance-code': localStorage.getItem('code') as string,
        },
        body: JSON.stringify({
          model: 'Settings',
          method: 'getInstanceSettings',
          arguments: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch instance settings: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.online_mode === 1;
    });

    if (isOnline) {
      console.log('✅ Instance is already online');
      return;
    }

    console.log('⚠️ Instance is offline, setting it to online...');

    // Set instance to online
    await page.evaluate(async () => {
      const response = await fetch(
        `${localStorage.getItem('api_url')}/api/controllers/model.php?setInstanceOnlineMode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'aula-instance-code': localStorage.getItem('code') as string,
          },
          body: JSON.stringify({
            model: 'Settings',
            method: 'setInstanceOnlineMode',
            arguments: {
              status: 1,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to set instance online: ${response.status}`);
      }
    });

    console.log('✅ Instance set to online');
  } catch (error) {
    console.error('❌ Failed to ensure instance is online:', error);
    throw error;
  }
}

/**
 * Pre-create shared test users ('user', 'student') before any workers start.
 * Without this, parallel workers all race to create the same users simultaneously,
 * each producing a different username hash — breaking cross-test userConfig assumptions.
 */
async function preCreateSharedUsers(browser: Browser, adminPage: Page, authStatesDir: string): Promise<void> {
  const usersToCreate = [
    { name: 'user', role: 20 },
    { name: 'student', role: 20 },
  ];

  for (const { name, role } of usersToCreate) {
    const metaPath = path.join(authStatesDir, `user-meta-${name}.json`);

    if (fs.existsSync(metaPath)) {
      console.log(`✓ Test user "${name}" already exists (cached), skipping`);
      continue;
    }

    console.log(`📝 Pre-creating test user "${name}" (role ${role})...`);
    const userData = entities.createUserData(name, role);

    userData.tempPass = await apiUsers.createUserViaAPI(adminPage, userData);

    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();
    await userPage.route('**/*', FILTER_EXCLUDED_RESOURCES);

    try {
      await userPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      await userInteractions.ensureInstanceEntered(userPage);

      const token = await apiUsers.registerUserViaAPI(userPage, userData);
      const storageStatePath = path.join(authStatesDir, `${userData.username}-context.json`);
      await apiUsers.saveAuthenticationState(userPage, token, storageStatePath);

      fs.writeFileSync(metaPath, JSON.stringify(userData), 'utf-8');
      console.log(`✅ Test user "${name}" (${userData.username}) pre-created`);
    } finally {
      await userPage.close();
      await userContext.close();
    }
  }
}
