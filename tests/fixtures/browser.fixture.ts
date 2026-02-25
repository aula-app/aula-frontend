import { test as base, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

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
        await context.storageState({ path: getStorageStatePath(username) });
        await context.close();
        console.info(`⚠️ Saved&Closed context for ${username}`);
      } catch (error) {
        console.warn(`⚠️ Could not save/close context for ${username}:`, error);
      }
    }
  },

  createUserPage: async ({ browser }, use) => {
    const createdPages: { page: Page; username: string; context: BrowserContext }[] = [];

    const userPageFactory = async (username: string): Promise<Page> => {
      console.log(`📖 Loading storage state for ${username}...`);

      const context = await browser.newContext({
        storageState: hasStorageState(username) ? getStorageStatePath(username) : undefined,
      });
      const page = await context.newPage();

      createdPages.push({ page, username, context });
      return page;
    };

    await use(userPageFactory);

    for (const { page, username, context } of createdPages) {
      try {
        await context.storageState({ path: getStorageStatePath(username) });
        await page.close();
        await context.close();
        console.info(`⚠️ Saved&Closed page/context for ${username}`);
      } catch (error) {
        console.warn(`⚠️ Could not save/close page/context for ${username}:`, error);
      }
    }
  },
});

export { expect } from '@playwright/test';
