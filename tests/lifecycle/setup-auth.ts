import { Browser, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { cleanupTestData } from './cleanup';

export default async function globalSetup() {
  console.log('🚀 Starting global setup...');

  // Purge any auth-states left over from a previously crashed run.
  // Without this, stale user-meta-*.json files cause the fixture's in-memory
  // userCache to load users whose backend state (e.g. changed passwords) no
  // longer matches what the cache records — making serial tests flaky.
  await cleanupTestData();
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  fs.mkdirSync(authStatesDir, { recursive: true });

  // Set up the Browser
  let browser: Browser | null = null;
  try {
    if (process.env.REMOTE_BROWSER === '1') {
      browser = await chromium.connect(process.env.PW_TEST_CONNECT_WS_ENDPOINT);
    } else {
      browser = await chromium.launch({
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
          // '--max-old-space-size=12000',
        ],
      });
    }

    console.log('✅ Global setup complete');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
