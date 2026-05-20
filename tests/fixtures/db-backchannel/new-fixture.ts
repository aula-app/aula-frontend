import { test as baseTest, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import * as userInteractions from '../../interactions/users';
import { RoomData, UserData } from '../../support/types';
import * as shared from '../../support/utils';
import { FILTER_EXCLUDED_RESOURCES } from '../shared/browser-consts';
import { getStorageStatePath } from '../shared/utils';
import { DbBackchannel } from './db-backchannel';

type WorkerFixtures = {
  dbName: string;
  baselineLoaded: void;
  authStateStudentPath: string;
  authStateUserPath: string;
  authStateAdminPath: string;
  seededRoom: RoomData;
  seededUser: UserData;
  seededStudent: UserData;
};

type BrowserFixtures = {
  newContextFor: (role: 'student' | 'user' | 'admin') => Promise<BrowserContext>;
  newPageFor: (role: 'student' | 'user' | 'admin') => Promise<Page>;
};

export const test = baseTest.extend<BrowserFixtures, WorkerFixtures>({
  dbName: [async ({ }, use, { workerIndex }) => {
    const idx = workerIndex ?? '0';
    const name = `db00${idx}`;
    await use(name);
  }, { scope: 'worker' }],

  baselineLoaded: [async ({ dbName }, use) => {
    const dbBackchannel = await DbBackchannel.getByInstanceCode(dbName);
    await dbBackchannel.truncateAll();
    await dbBackchannel.seed();
    await use(undefined);
  }, { scope: 'worker' }],

  authStateStudentPath: [async ({ baselineLoaded, dbName, browser }, use) => {
    const storageStatePath = getStorageStatePath(`${dbName}_student`);

    // use browser to create state if missing
    if (!fs.existsSync(storageStatePath)) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

      console.log(`↔️ Accessing tested instance ${dbName} as student`);
      await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      await userInteractions.ensureSpecificInstanceEntered(page, dbName);
      await userInteractions.login(page, { username: 'student', password: 'aula' });
      await page.waitForFunction(() => localStorage.getItem('token'));

      await ctx.storageState({ path: storageStatePath });
      await ctx.close();
    }

    await use(storageStatePath);
  }, { scope: 'worker' }],

  authStateUserPath: [async ({ baselineLoaded, dbName, browser }, use) => {
    const storageStatePath = getStorageStatePath(`${dbName}_user`);

    // use browser to create state if missing
    if (!fs.existsSync(storageStatePath)) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

      console.log(`↔️ Accessing tested instance ${dbName} as user`);
      await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      await userInteractions.ensureSpecificInstanceEntered(page, dbName);
      await userInteractions.login(page, { username: 'user', password: 'aula' });
      await page.waitForFunction(() => localStorage.getItem('token'));

      await ctx.storageState({ path: storageStatePath });
      await ctx.close();
    }

    await use(storageStatePath);
  }, { scope: 'worker' }],

  authStateAdminPath: [async ({ baselineLoaded, dbName, browser }, use) => {
    const storageStatePath = getStorageStatePath(`${dbName}_admin`);

    // use browser to create state if missing
    if (!fs.existsSync(storageStatePath)) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.route('**/*', FILTER_EXCLUDED_RESOURCES);

      console.log(`↔️ Accessing tested instance ${dbName} as admin`);
      await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      await userInteractions.ensureSpecificInstanceEntered(page, dbName);
      await userInteractions.login(page, { username: 'admin', password: 'aula' });
      await page.waitForFunction(() => localStorage.getItem('token'));

      await ctx.storageState({ path: storageStatePath });
      await ctx.close();
    }

    await use(storageStatePath);
  }, { scope: 'worker' }],

  seededStudent: [async ({ dbName, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({
      displayName: 'e2e.student',
      realName: 'student studentic',
      username: 'student',
      role: 20,
      about: 'e2e test student',
      password: 'aula'
    });
  }, { scope: 'worker' }],

  seededUser: [async ({ dbName, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({
      displayName: 'e2e.user',
      realName: 'user useric',
      username: 'user',
      role: 20,
      about: 'e2e test user',
      password: 'aula'
    });
  }, { scope: 'worker' }],

  seededRoom: [async ({ dbName, baselineLoaded }, use) => {
    // return minimal descriptor from baseline; no DB mutation
    await use({ name: 'e2e.class_1A', description: 'e2e test room of class 1A', users: [{ username: 'e2e.student.class_1A' }] });
  }, { scope: 'worker' }],

  // factory to create a new authenticated context (test-scoped)
  newContextFor: [async ({ browser, authStateStudentPath, authStateUserPath, authStateAdminPath }, use) => {
    const mapping: Record<string, string> = {
      student: authStateStudentPath,
      user: authStateUserPath,
      admin: authStateAdminPath,
    };
    // track created contexts for cleanup
    const created: BrowserContext[] = [];
    const factory = async (role: 'student' | 'user' | 'admin') => {
      const state = mapping[role];
      const ctx = await browser.newContext({ storageState: state });
      created.push(ctx);
      return ctx;
    };
    await use(factory);
    // cleanup after test
    await Promise.all(created.map(c => c.close().catch(() => { })));
  }, { scope: 'test' }],

  // factory to create a fresh page for a role
  newPageFor: [async ({ newContextFor }, use) => {
    const createdPages: Page[] = [];
    const factory = async (role: 'student' | 'user' | 'admin') => {
      const ctx = await newContextFor(role);
      const page = await ctx.newPage();
      createdPages.push(page);
      return page;
    };
    await use(factory);
    // ensure pages closed (contexts will be closed by newContextFor cleanup)
    await Promise.all(createdPages.map(p => p.close().catch(() => { })));
  }, { scope: 'test' }],
});

export { expect } from '@playwright/test';
