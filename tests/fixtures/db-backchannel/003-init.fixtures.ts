import { BrowserContext, Page } from '@playwright/test';
import { RoleTypes } from '../../../src/types/SettingsTypes';
import * as apiUsers from '../../helpers/api-users';
import * as userInteractions from '../../interactions/users';
import { UserData } from '../../support/types';
import * as shared from '../../support/utils';
import { AulaFixtures, TestFixtures, UserFixtures } from '../shared/aula-fixtures.interface';
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
  init: async ({ dbReset, ensureUser, ensureRoom, newPage }, use) => {

    const initializationFn = async<K extends readonly (keyof UserFixtures)[]>(include?: K): Promise<{ [P in K[number]]: UserFixtures[P] }> => {
      type PickFromTestFixtures<K extends readonly (keyof UserFixtures)[]> = { [P in K[number]]: UserFixtures[P] };

      async function helper<F extends keyof UserFixtures>(include: K, field: F, response: PickFromTestFixtures<K>, fn: Promise<UserFixtures[F]>) {
        if (include.includes(field)) {
          fn.then(res => response[field] = res);
        }
      }

      await dbReset();

      const response = {} as PickFromTestFixtures<K>;
      if (!include || include.length === 0) return response;

      // helper(include, 'userConfig', response, ensureUser('user', 20));
      // helper(include, 'studentConfig', response, ensureUser('student', 20));
      // helper(include, 'userPage', response, newPage('user', 20));
      // helper(include, 'studentPage', response, newPage('student', 20));
      // helper(include, 'room', response, ensureRoom('user', 20));

      if (include.includes('userConfig')) {
        (response as any)['userConfig'] = await ensureUser('user', 20);
      }
      if (include.includes('studentConfig')) {
        (response as any)['studentConfig'] = await ensureUser('student', 20);
      }

      if (include.includes('userPage')) {
        (response as any)['userPage'] = await newPage('user', 20);
      }
      if (include.includes('studentPage')) {
        (response as any)['studentPage'] = await newPage('user', 20);
      }

      if (include.includes('room')) {
        // const users = [{ username: response.userConfig!.username }, { username: response.studentConfig!.username }];
        // (response as any)['room'] = await ensureRoom('room', users);
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
