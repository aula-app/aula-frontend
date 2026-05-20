import { test as base, BrowserContext } from '@playwright/test';
import * as userInteractrions from '../../interactions/users';
import * as shared from '../../support/utils';
import { AulaFixtures } from './aula-fixtures.interface';
import { FILTER_EXCLUDED_RESOURCES } from './browser-consts';
import { getStorageStatePath, hasStorageState } from './utils';
import { UserData } from '../../support/types';

export interface BrowserWorkerFixtures {
  adminContext: BrowserContext;
}

export const admin: UserData = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};

export const adminContextFixture = base.extend<AulaFixtures, BrowserWorkerFixtures>({
  adminContext: [
    async ({ browser }, use) => {
      const storageStatePath = getStorageStatePath('admin');
      const context = await browser.newContext({
        storageState: hasStorageState('admin') ? storageStatePath : undefined,
      });

      // Ensure admin is logged in
      const page = await context.newPage();
      await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      const token = await page.evaluate(() => localStorage.getItem('token'));
      if (!token) {
        await userInteractrions.ensureInstanceEntered(page);
        await userInteractrions.login(page, admin);
      }
      // @TODO: see if this works
      await page.close();

      await use(context);

      try {
        await context.storageState({ path: storageStatePath });
        // await page.close();
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
    // await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
    await use(page);
  },
});

export { expect } from '@playwright/test';
