import { BrowserContext, Page } from '@playwright/test';
import { adminContextFixture } from '../shared/000-admin.worker-fixture';
import { FILTER_EXCLUDED_RESOURCES } from '../shared/browser-consts';
import { getStorageStatePath, hasStorageState } from '../shared/utils';

interface BrowserTestFixtures {
  createUserPage: (username: string) => Promise<Page>;
}

export const browserViaUiFixture = adminContextFixture.extend<BrowserTestFixtures>({
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
