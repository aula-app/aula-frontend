import { test as base, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as shared from '../support/utils';

interface BrowserWorkerFixtures {
  adminContext: BrowserContext;
}

interface BrowserTestFixtures {
  adminPage: Page;
  createUserContext: (username: string) => Promise<BrowserContext>;
  createUserPage: (username: string) => Promise<Page>;
}

const AUTH_STATES_DIR = 'tests/auth-states';

function getStorageStatePath(username: string): string {
  return path.join(AUTH_STATES_DIR, `${username}-context.json`);
}

function hasStorageState(username: string): boolean {
  return fs.existsSync(getStorageStatePath(username));
}

export const test = base.extend<BrowserTestFixtures, BrowserWorkerFixtures>({
  adminContext: [
    async ({ browser }, use) => {
      const storageStatePath = getStorageStatePath('admin');
      const context = await browser.newContext({
        storageState: hasStorageState('admin') ? storageStatePath : undefined,
      });

      await use(context);

      try {
        await context.storageState({ path: storageStatePath });
        await context.close();
      } catch (error) {
        console.warn('⚠️ Could not save/close admin context:', error);
      }
    },
    { scope: 'worker' },
  ],

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
  },

  createUserContext: async ({ browser }, use) => {
    const createdContexts: { context: BrowserContext; username: string }[] = [];

    const factory = async (username: string): Promise<BrowserContext> => {
      const storageStatePath = getStorageStatePath(username);
      const context = await browser.newContext({
        storageState: hasStorageState(username) ? storageStatePath : undefined,
      });
      createdContexts.push({ context, username });
      return context;
    };

    await use(factory);

    for (const { context, username } of createdContexts) {
      try {
        const storageStatePath = getStorageStatePath(username);
        await context.storageState({ path: storageStatePath });
        await context.close();
      } catch (error) {
        console.warn(`⚠️ Could not save/close context for ${username}:`, error);
      }
    }
  },

  createUserPage: async ({ browser }, use) => {
    const createdPages: { page: Page; username: string; context: BrowserContext }[] = [];

    const factory = async (username: string): Promise<Page> => {
      const storageStatePath = getStorageStatePath(username);
      console.log(`📖 Loading storage state for ${username} from ${storageStatePath}`);
      console.log(`   Storage state exists: ${hasStorageState(username)}`);

      const context = await browser.newContext({
        storageState: hasStorageState(username) ? storageStatePath : undefined,
      });
      const page = await context.newPage();

      // Navigate to app so the user is actually logged in
      await page.goto(shared.getHost());
      await page.waitForLoadState('networkidle');

      // Debug: Check if token is actually in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      console.log(`   Token in localStorage: ${token ? 'YES' : 'NO'}`);

      // Debug: Check if user is logged in by looking for rooms-heading
      const isLoggedIn = await page.locator('#rooms-heading').isVisible().catch(() => false);
      console.log(`   User appears logged in: ${isLoggedIn ? 'YES' : 'NO'}`);

      createdPages.push({ page, username, context });
      return page;
    };

    await use(factory);

    for (const { page, username, context } of createdPages) {
      try {
        const storageStatePath = getStorageStatePath(username);
        await context.storageState({ path: storageStatePath });
        await page.close();
        await context.close();
      } catch (error) {
        console.warn(`⚠️ Could not save/close page/context for ${username}:`, error);
      }
    }
  },
});

export { expect } from '@playwright/test';
