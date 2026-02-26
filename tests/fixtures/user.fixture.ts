import { UserData } from '../support/types';
import { createUserData } from '../helpers/entities';
import * as apiUsers from '../helpers/api-users';
import { test as browserTest } from './browser.fixture';
import { RoleTypes } from '../../src/types/SettingsTypes';
import * as shared from '../support/utils';
import { ensureInstanceEntered } from '../interactions/users';
import { FILTER_EXCLUDED_RESOURCES } from '../fixtures/browser.fixture';

interface UserFixtures {
  ensureUser: (name: string, role?: RoleTypes) => Promise<UserData>;
}

const userCache: Record<string, UserData> = {};

export const admin: UserData = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};

export const test = browserTest.extend<UserFixtures>({
  ensureUser: async ({ browser }, use) => {
    const adminContext = await browser.newContext({
      storageState: 'tests/auth-states/admin-context.json',
    });
    const adminPage = await adminContext.newPage();
    await adminPage.route('**/*', FILTER_EXCLUDED_RESOURCES);
    await adminPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
    await ensureInstanceEntered(adminPage);

    const factory = async (name: string, role: RoleTypes = 20): Promise<UserData> => {
      if (userCache[name]) {
        console.log(`✓ User ${name} already exists (cached)`);
        return userCache[name];
      }

      console.log(`📝 Creating user: ${name} with role ${role}`);
      const userData = createUserData(name, role);

      try {
        userData.tempPass = await apiUsers.createUserViaAPI(adminPage, userData);
        console.log(`✅ User ${name} created via API`);

        console.log(`🔐 Registering ${name} and changing password via API`);
        const userContext = await browser.newContext();
        const userPage = await userContext.newPage();
        await userPage.route('**/*', FILTER_EXCLUDED_RESOURCES);

        await userPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await ensureInstanceEntered(userPage);

        const token = await apiUsers.registerUserViaAPI(userPage, userData);
        const storageStatePath = `tests/auth-states/${userData.username}-context.json`;
        await apiUsers.saveAuthenticationState(userPage, token, storageStatePath);
        console.log(`✅ User ${name} (${userData.username}) registered and authenticated via API`);

        await userPage.close();
        await userContext.close();
      } catch (error) {
        console.error(`❌ Failed to create user ${name}:`, error);
        throw error;
      }

      userCache[name] = userData;
      return userData;
    };

    await use(factory);
  },
});

export { expect } from '@playwright/test';
