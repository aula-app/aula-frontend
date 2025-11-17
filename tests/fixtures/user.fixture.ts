import { Page } from '@playwright/test';
import { UserData } from '../support/types';
import { createUserData } from '../helpers/entities';
import * as apiUsers from '../helpers/api-users';
import { test as browserTest } from './browser.fixture';
import { RoleTypes } from '../../src/types/SettingsTypes';
import * as shared from '../support/utils';

interface UserFixtures {
  ensureUser: (name: string, role?: RoleTypes) => Promise<UserData>;
}

const userCache: Record<string, UserData> = {};

export const admin: UserData = {
  username: 'admin',
  password: 'aula',
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
    await adminPage.goto(shared.getHost());
    await adminPage.waitForLoadState('networkidle');

    const factory = async (name: string, role: RoleTypes = 20): Promise<UserData> => {
      if (userCache[name]) {
        console.log(`✓ User ${name} already exists (cached)`);
        return userCache[name];
      }

      console.log(`📝 Creating user: ${name} with role ${role}`);
      const userData = createUserData(name, role);

      try {
        const tempPassword = await apiUsers.createUserViaAPI(adminPage, userData);
        userData.tempPass = tempPassword;
        console.log(`✅ User ${name} created via API`);

        console.log(`🔐 Registering ${name} and changing password via API`);
        const userContext = await browser.newContext();
        const userPage = await userContext.newPage();

        await userPage.goto(shared.getHost());
        await userPage.waitForLoadState('networkidle');

        const token = await apiUsers.registerUserViaAPI(userPage, userData, tempPassword);
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
