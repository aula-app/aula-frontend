// called from playwright.config

import * as fs from 'fs';
import * as path from 'path';
import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users';
import { admin } from '../fixtures/users';

export default async function globalSetup() {
  console.log('Setting up!');

  // Create a new run-id for this test run
  createNewRunId();

  await browsers.init();

  const adminPage = await browsers.getUserBrowser('admin');
  await userInteractions.login(adminPage, admin);

  // Verify token exists before saving
  const token = await adminPage.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    throw new Error('❌ Setup failed: Admin login did not save token to localStorage');
  }

  console.log('✅ Admin logged in with token');

  await browsers.pickle();

  console.log('✅ Setup complete');
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
