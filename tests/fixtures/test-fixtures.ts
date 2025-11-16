import { test as base, Page } from '@playwright/test';
import { UserData } from "../support/types";
import * as userData from './data/users';
import * as browsers from '../interactions/browsers';

/**
 * Extended test fixtures for Aula e2e tests
 * Uses Playwright's native fixture system for proper dependency injection and cleanup
 */

interface AulaFixtures {
  adminPage: Page;
  userPage: Page;
  studentPage: Page;
  userConfig: UserData;
  studentConfig: UserData;
}

export const test = base.extend<AulaFixtures>({
  // Admin browser - always available
  adminPage: async ({}, use) => {
    const admin = await browsers.getUserBrowser('admin');
    await use(admin);
  },

  // User config - creates user data fixture
  userConfig: async ({}, use) => {
    const user = await userData.use('user');
    await use(user);
  },

  // User browser - depends on userConfig
  userPage: async ({ userConfig }, use) => {
    const userBrowser = await browsers.getUserBrowser(userConfig.username);
    await use(userBrowser);
  },

  // Student config - creates student data fixture
  studentConfig: async ({}, use) => {
    const student = await userData.use('student');
    await use(student);
  },

  // Student browser - depends on studentConfig
  studentPage: async ({ studentConfig }, use) => {
    const studentBrowser = await browsers.getUserBrowser(studentConfig.username);
    await use(studentBrowser);
  },
});

export { expect } from '@playwright/test';
