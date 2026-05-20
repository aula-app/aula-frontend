import { TestType } from '@playwright/test';
import { testViaDbFixture } from './db-backchannel/004-test.fixture';
import { AulaFixtures } from './shared/aula-fixtures.interface';
import { userViaUiFixture } from './ui-browser/002-user.fixture';
import { BrowserWorkerFixtures } from './shared/000-admin.worker-fixture';

/**
 * Configure test with serial mode by default (for mutation tests)
 */
export const test: TestType<AulaFixtures, BrowserWorkerFixtures> =
  process.env.DB_BACKCHANNEL !== 'false'

    ? testViaDbFixture

    : userViaUiFixture.extend<AulaFixtures>({

      newPage: async () => { },

      initAndUserPage: async ({ init, newPage }, use) => {
        await init();
        return use(await newPage('user', 20));
      },

      // @TODO: for newPage maybe pull out of storage when going via UI?
      // const context = await browser.newContext({
      //   storageState: hasStorageState(username) ? getStorageStatePath(username) : undefined,
      // });
    });

export { expect } from '@playwright/test';
