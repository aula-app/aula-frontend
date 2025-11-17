// Global setup for Playwright tests
// Called once before all tests run

import * as fs from 'fs';
import * as path from 'path';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as userInteractions from '../interactions/users';
import { admin } from '../fixtures/user.fixture';

export default async function globalSetup() {
  console.log('🚀 Starting global setup...');

  // Create a new run-id for this test run
  createNewRunId();

  // Create auth-states directory if it doesn't exist
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  if (!fs.existsSync(authStatesDir)) {
    fs.mkdirSync(authStatesDir, { recursive: true });
  }

  // Launch browser and authenticate admin
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Log in admin
    await userInteractions.login(page, admin);

    // Verify token exists before saving
    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('❌ Setup failed: Admin login did not save token to localStorage');
    }

    console.log('✅ Admin logged in with token');

    // Save admin authentication state
    const adminStatePath = path.join(authStatesDir, 'admin-context.json');
    await context.storageState({ path: adminStatePath });
    console.log(`✅ Admin state saved to ${adminStatePath}`);

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
