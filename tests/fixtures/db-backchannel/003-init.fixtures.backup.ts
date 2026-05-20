import { BrowserContext, Page } from '@playwright/test';
import { RoleTypes } from '../../../src/types/SettingsTypes';
import * as apiUsers from '../../helpers/api-users';
import * as userInteractions from '../../interactions/users';
import { UserData } from '../../support/types';
import * as shared from '../../support/utils';
import { AulaFixtures, TestFixtures, TestFixturesParams } from '../shared/aula-fixtures.interface';
import { FILTER_EXCLUDED_RESOURCES } from '../shared/browser-consts';
import { getStorageStatePath, hasStorageState } from '../shared/utils';
import { userViaDbFixture } from './002-user.fixture';

/**
 * Configure test with serial mode by default (for mutation tests)
 */
export const initViaDbFixture = userViaDbFixture.extend<AulaFixtures>({
  // export const test = userTestFixture.extend<AulaFixtures & { init: (include: Array<keyof AulaFixtures>) => Promise<Partial<AulaFixtures>> }>({

  /**
   * User config - creates/retrieves user data
   */
  userConfig: async ({ ensureUser }, use) => {
    const user = await ensureUser('user', 20);
    await use(user);
  },

  /**
   * Student config - creates/retrieves student data
   */
  studentConfig: async ({ ensureUser }, use) => {
    const student = await ensureUser('student', 20);
    await use(student);
  },

  /**
   * Playwright fixtures run in dependency order at setup time, not at the moment you call the helper inside the test. 
   * Having { dbReset } on `init` only ensures `dbReset` runs before the fixture is set up — it does not cause an 
   * extra reset when you call the helper returned by that fixture.
   */
  init: async ({ dbReset, ensureUser, newPage }, use) => {

    const initializationFn = async (params: TestFixturesParams): Promise<TestFixtures> => {
      await dbReset();

      const response: TestFixtures = {};
      if (Object.keys(params).length === 0) return response;

      response.userConfig = params.userConfig
        ? await ensureUser(params.userConfig.username, params.userConfig.userlevel)
        : undefined;
      response.studentConfig = params.studentConfig
        ? await ensureUser(params.studentConfig.username, params.studentConfig.userlevel)
        : undefined;

      response.userPage = params.userPage
        ? await newPage(params.userPage.username, params.userPage.userlevel)
        : undefined;
      response.studentPage = params.studentPage
        ? await newPage(params.studentPage.username, params.studentPage.userlevel)
        : undefined;

      if (params.room) {
        // response['room'] = await ensureRoom('room');
      }

      return response;
    }

    await use(initializationFn);
  },

  newPage: async ({ ensureUser, browser }, use) => {
    let userPage: Page;
    const createdPages: { userPage: Page; userData: UserData; userContext: BrowserContext }[] = [];

    const fn = async (username: string, role: RoleTypes) => {
      const isFirstTimeUser = !hasStorageState(username);
      const userContext = await browser.newContext({
        storageState: isFirstTimeUser ? undefined : getStorageStatePath(username),
      });

      if (!isFirstTimeUser) {
        // we already have the user created and logged in
        userPage = await userContext.newPage();
        await userPage.route('**/*', FILTER_EXCLUDED_RESOURCES);
      } else {
        // we should create user and log her in
        const userData = await ensureUser(username, role);
        userPage = await userContext.newPage();
        await userPage.route('**/*', FILTER_EXCLUDED_RESOURCES);

        console.log(`↔️ Accessing tested instance in user's browser using instance code.`);
        await userPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await userInteractions.ensureInstanceEntered(userPage);
        await userInteractions.login(userPage, userData);

        await userPage.waitForFunction(() => localStorage.getItem('token'));
        const { token } = await userPage.evaluate(() => ({
          token: localStorage.getItem('token'),
        }));

        const storageStatePath = `tests/auth-states/${userData.username}-context.json`;
        await apiUsers.saveAuthenticationState(userPage, token!, storageStatePath);
        console.log(`✅ User "${userData.username}" (${userData.displayName}) registered via DB and login via UI`);

        createdPages.push({ userPage, userData, userContext });
      }

      return userPage;
    }

    await use(fn);

    for (const { userPage, userData, userContext } of createdPages) {
      try {
        await userContext.storageState({ path: getStorageStatePath(userData.username) });
        if (userPage) await userPage.close();
        if (userContext) await userContext.close();
      } catch { } finally { }
    }
  }

});

export { expect } from '@playwright/test';
