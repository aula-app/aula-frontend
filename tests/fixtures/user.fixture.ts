import * as fs from 'fs';
import * as path from 'path';
import type { BrowserContext, Page } from '@playwright/test';
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

const AUTH_STATES_DIR = path.join(process.cwd(), 'tests/auth-states');
const META_PREFIX = 'user-meta-';

function metaPath(name: string): string {
  return path.join(AUTH_STATES_DIR, `${META_PREFIX}${name}.json`);
}

// Persist user metadata to disk so retries don't recreate the same user.
function saveUserMeta(name: string, data: UserData): void {
  fs.writeFileSync(metaPath(name), JSON.stringify(data), 'utf-8');
}

// Load all previously created users into the cache at module init.
const userCache: Record<string, UserData> = (() => {
  const cache: Record<string, UserData> = {};
  if (!fs.existsSync(AUTH_STATES_DIR)) return cache;
  for (const file of fs.readdirSync(AUTH_STATES_DIR)) {
    if (file.startsWith(META_PREFIX) && file.endsWith('.json')) {
      const name = file.slice(META_PREFIX.length, -'.json'.length);
      try {
        cache[name] = JSON.parse(fs.readFileSync(path.join(AUTH_STATES_DIR, file), 'utf-8'));
      } catch {}
    }
  }
  return cache;
})();

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
    // Lazily initialized — only created if a user actually needs to be created
    let adminContext: BrowserContext | null = null;
    let adminPage: Page | null = null;

    const getAdminPage = async (): Promise<Page> => {
      if (!adminPage) {
        adminContext = await browser.newContext({
          storageState: 'tests/auth-states/admin-context.json',
        });
        adminPage = await adminContext.newPage();
        await adminPage.route('**/*', FILTER_EXCLUDED_RESOURCES);
        await adminPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await ensureInstanceEntered(adminPage);
      }
      return adminPage;
    };

    const factory = async (name: string, role: RoleTypes = 20): Promise<UserData> => {
      if (userCache[name]) {
        console.log(`✓ User "${name}" already exists (cached)`);
        return userCache[name];
      }

      console.log(`📝 Creating user: "${name}" with role ${role}`);
      const userData = createUserData(name, role);
      const adminPg = await getAdminPage();

      try {
        userData.tempPass = await apiUsers.createUserViaAPI(adminPg, userData);
        console.log(`✅ User "${name}" created via API`);

        const userContext = await browser.newContext();
        const userPage = await userContext.newPage();
        await userPage.route('**/*', FILTER_EXCLUDED_RESOURCES);

        console.log(`↔️ Accessing tested instance in user's browser using instance code.`);
        await userPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await ensureInstanceEntered(userPage);

        console.log(`🔐 Registering "${name}" and changing password via API (through user's browser page)`);
        const token = await apiUsers.registerUserViaAPI(userPage, userData);
        const storageStatePath = `tests/auth-states/${userData.username}-context.json`;
        await apiUsers.saveAuthenticationState(userPage, token, storageStatePath);
        console.log(`✅ User "${name}" (${userData.username}) registered and authenticated via API`);

        await userPage.close();
        await userContext.close();
      } catch (error) {
        console.error(`❌ Failed to create user "${name}":`, error);
        throw error;
      }

      userCache[name] = userData;
      saveUserMeta(name, userData);
      return userData;
    };

    await use(factory);
  },
});

export { expect } from '@playwright/test';
