import { test as base, BrowserContext, Page, Route } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const RESOURCE_EXCLUSIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
export const FILTER_EXCLUDED_RESOURCES = (route: Route) =>
  RESOURCE_EXCLUSIONS.includes(route.request().resourceType()) ? route.abort() : route.continue();

interface BrowserWorkerFixtures {
  adminContext: BrowserContext;
}

interface BrowserTestFixtures {
  adminPage: Page;
  createUserPage: (username: string) => Promise<Page>;
}

const AUTH_STATES_DIR = 'tests/auth-states';

function getStorageStatePath(username: string): string {
  return path.join(AUTH_STATES_DIR, `${username}-context.json`);
}

function hasStorageState(username: string): boolean {
  return fs.existsSync(getStorageStatePath(username));
}

export const browserTestFixture = base.extend<BrowserTestFixtures, BrowserWorkerFixtures>({
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
    await page.route('**/*', FILTER_EXCLUDED_RESOURCES);
    await use(page);
  },

  createUserPage: async ({ browser }, use) => {
    const createdPages: { page: Page; username: string; context: BrowserContext }[] = [];

    const userPageFactory = async (username: string): Promise<Page> => {
      console.log(`📖 ${!hasStorageState(username) ? 'Creating' : 'Loading'} storage state for ${username}...`);
      const context = await browser.newContext({
        storageState: hasStorageState(username) ? getStorageStatePath(username) : undefined,
      });
      const page = await context.newPage();
      await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

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
