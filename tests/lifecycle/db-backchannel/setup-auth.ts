import { Browser, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { DbBackchannel } from '../../fixtures/db-backchannel/db-backchannel';
import { cleanupAuthStates } from './cleanup';


export default async function globalSetup() {
  console.log('🚀 Starting global setup...');

  // Purge any auth-states left over from a previously crashed run.
  // Without this, stale user-meta-*.json files cause the fixture's in-memory
  // userCache to load users whose backend state (e.g. changed passwords) no
  // longer matches what the cache records — making serial tests flaky.
  await cleanupAuthStates();
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  fs.mkdirSync(authStatesDir, { recursive: true });

  // Create a new run-id for this test run
  createNewRunId();

  // Launch browser and authenticate admin
  let browser: Browser | null = null;
  // let context: BrowserContext | null = null;
  // let page: Page | null = null;

  try {

    // Scrub any test data left in the DB from a previously crashed run.
    // globalTeardown only runs when the process exits cleanly; if it was killed
    // mid-run, orphaned test-* entities accumulate and cause flaky failures.
    // console.log('🧹 Scrubbing leftover test data from previous run...');
    // const dbBackchannel = await DbBackchannel.getInstance();
    // await dbBackchannel.truncateAll();
    // await dbBackchannel.seed();

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
    // context = await browser.newContext();
    // page = await context.newPage();
    // await page.route('**/*', FILTER_EXCLUDED_RESOURCES);
    //
    // // Log in admin
    // await userInteractions.login(page, admin);
    //
    // // Verify if admin's token exists in localStorage before saving admin auth state
    // const token = await page.evaluate(() => localStorage.getItem('token'));
    // if (!token) {
    //   throw new Error('❌ Setup failed: Admin login did not save token to localStorage');
    // }
    // console.log('✅ Admin logged in with token');
    //
    // await ensureInstanceOnline(page);
    // console.log('✅ Instance is online');
    //
    // // Save admin authentication state
    // const adminStatePath = path.join(authStatesDir, 'admin-context.json');
    // await context.storageState({ path: adminStatePath });
    // console.log(`✅ Admin state saved to ${adminStatePath}`);
    //
    // // Pre-create shared test users so parallel workers all read from disk cache
    // // instead of racing to create the same users with different hashes.
    // await preCreateSharedUsers(browser, page, authStatesDir);

    console.log('✅ Global setup complete');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    // Cleanup
    // if (page) await page.close();
    // if (context) await context.close();
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
