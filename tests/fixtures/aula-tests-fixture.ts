import { test as baseTest, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import * as userInteractions from '../interactions/users';
import { RoomData, UserData } from '../support/types';
import * as shared from '../support/utils';
import { FILTER_EXCLUDED_RESOURCES, getStorageStatePath } from './utils';
import { DbBackchannel } from './db-backchannel';
import { TestConstants } from '../support/config';

type WorkerFixtures = {
  // Fixture to determine the DB instance_code based on worker's parallelIndex
  dbInstanceCode: string;

  // Fixture to ensure singleton DbBackchannel is loaded and DB is re-seeded
  baselineLoaded: void;

  // Fixture that ensures browser context is bootstrapped, returning local file path of the context
  ensureStatePathFor: (username: string) => Promise<string | null>;

  // Convenience fixtures to return value objects representing data seeded to the DB
  seededRoom: RoomData;
  seededStudent: UserData;
  seededUser: UserData;
};

type BrowserFixtures = {
  newContextFor: (username: string) => Promise<BrowserContext>;
  newPageFor: (username: string) => Promise<Page>;

  // Fixture to ensure singleton DbBackchannel is loaded and DB is re-seeded
  baselineReload: () => Promise<void>;
};

export const test = baseTest.extend<BrowserFixtures, WorkerFixtures>({
  /**
   * Prefer `parallelIndex` over `workerIndex` because it's always in the stable range of
   * 0..${workers - 1}, while `workerIndex` is always incremented, beyond max workers count
   */
  dbInstanceCode: [async ({ }, use, { parallelIndex }) => {
    const idx = parallelIndex ?? '0';
    const name = `db00${idx}`;
    await use(name);
  }, { scope: 'worker' }],

  baselineLoaded: [async ({ dbInstanceCode }, use) => {
    const dbBackchannel = await DbBackchannel.getByInstanceCode(dbInstanceCode);
    await dbBackchannel.truncateAll();
    await dbBackchannel.seed();
    console.log(`󰳿 [PW.worker] DB baseline loaded. instance: "${dbInstanceCode}"`);

    await use(undefined);
  }, { scope: 'worker' }],

  ensureStatePathFor: [async ({ baselineLoaded, dbInstanceCode, browser }, use) => {
    const hasLoggedInState: Record<string, boolean> = {};

    const factory = async (username: string) => {
      const storageStatePath = getStorageStatePath(`${dbInstanceCode}_${username}`);

      // use browser to create state (if state is missing) or (if log-in wasn't successful last time)
      if (!fs.existsSync(storageStatePath) || !hasLoggedInState[username]) {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

        console.log(`󱐎 [PW.worker] Using instance: "${dbInstanceCode}", username: "${username}"`);
        await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await userInteractions.ensureSpecificInstanceEntered(page, dbInstanceCode);

        try {
          await userInteractions.login(page, { username: username, password: TestConstants.DEFAULT_PASSWORD });
          await page.waitForFunction(() => localStorage.getItem('token'));
          await ctx.storageState({ path: storageStatePath });
          await ctx.close();
          hasLoggedInState[username] = true;
        } catch (e) {
          // ignored because this might be fine, for example newly created users have to 
          // go through the process of setting their password the first time using tempPass (see CSV import test)
          console.log(`󱞭 [PW.worker] Login failed. Should retry. instance: "${dbInstanceCode}", username: "${username}"`);
          hasLoggedInState[username] = false;
          // but, still we should return 'null' so that the 
          // context would be set later after first-time registration is complete
          return null;
        }
      }
      return storageStatePath;
    }

    return await use(factory);

    // @NOTE: no cleanup happening here, we let the global teardown cleanup all leftover auth state files
  }, { scope: 'worker' }],

  seededStudent: [async ({ dbInstanceCode, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({
      displayName: 'e2e.student',
      realName: 'Student Studentić',
      username: 'student',
      hashId: 'e2e.user.20.student',
      role: 20,
      about: 'e2e test student',
      password: TestConstants.DEFAULT_PASSWORD,
      email: 'dev+e2e-student@aula.de'
    });
  }, { scope: 'worker' }],

  seededUser: [async ({ dbInstanceCode, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({
      displayName: 'e2e.user',
      realName: 'User Userić',
      username: 'user',
      hashId: 'e2e.user.20.user',
      role: 20,
      about: 'e2e test user',
      password: TestConstants.DEFAULT_PASSWORD,
      email: 'dev+e2e-user@aula.de'
    });
  }, { scope: 'worker' }],

  seededRoom: [async ({ dbInstanceCode, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({
      name: 'e2e.class_1A',
      description: 'e2e test room of class 1A',
      users: [{ username: 'user' }, { username: 'student' }]
    });
  }, { scope: 'worker' }],

  // Reseed the worker's database (needs to be invoked after the test execution, used in newContextFor teardown)
  baselineReload: [async ({ dbInstanceCode }, use) => {
    const reload = async () => {
      const dbBackchannel = await DbBackchannel.getByInstanceCode(dbInstanceCode);
      await dbBackchannel.truncateAll();
      await dbBackchannel.seed();
      console.log(`󰳿 baselineReloaded for ${dbInstanceCode}`);
    }
    await use(reload);
  }, { scope: 'test' }],

  // factory to create a new authenticated context (test-scoped)
  newContextFor: [async ({ browser, ensureStatePathFor, baselineReload }, use) => {
    const [student, user, admin] = await Promise.all([
      ensureStatePathFor('student'),
      ensureStatePathFor('user'),
      ensureStatePathFor('admin'),
    ]);
    const precreatedStorageStates: Record<string, string> = { student: student!, user: user!, admin: admin! };
    // track created contexts for cleanup
    const createdBrowserContexts: BrowserContext[] = [];
    const factory = async (username: string) => {
      const ctx = precreatedStorageStates[username]
        ? await browser.newContext({ storageState: precreatedStorageStates[username] })
        : (await ensureStatePathFor(username)
          ? await browser.newContext({ storageState: (await ensureStatePathFor(username))! })
          : await browser.newContext());
      createdBrowserContexts.push(ctx);
      return ctx;
    };
    await use(factory);
    // cleanup after test
    await Promise.all(createdBrowserContexts.map(c => c.close().catch(() => { })));
    // await baselineReload();
  }, { scope: 'test' }],

  // factory to create a fresh page for a role
  newPageFor: [async ({ newContextFor }, use) => {
    const createdPages: Page[] = [];
    const factory = async (username: string) => {
      const ctx = await newContextFor(username);
      const page = await ctx.newPage();
      createdPages.push(page);
      return page;
    };
    await use(factory);
    // ensure pages closed after test is executed (contexts will be closed by newContextFor cleanup)
    await Promise.all(createdPages.map(p => p.close().catch(() => { })));
  }, { scope: 'test' }],
});

export { expect } from '@playwright/test';
