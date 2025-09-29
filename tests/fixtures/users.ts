import * as types from './types';
import * as shared from '../shared/shared';
import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users.ts';

/* User roles
 * 10 => "guest",
 * 20 => "user",
 * 30 => "moderator",
 * 31 => "moderator_v",
 * 40 => "super_moderator",
 * 41 => "super_moderator_v",
 * 44 => "principal",
 * 45 => "principal_v",
 * 50 => "admin",
 * 60 => "tech_admin"
 */

export let alice: types.UserData;
export let bob: types.UserData;
export let mallory: types.UserData;
export let burt: types.UserData;
export let rainer: types.UserData;
export const admin: types.UserData = {
  username: 'admin',
  password: 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};

export const init = () => {
  const runId = shared.getRunId();
  console.log('Run ID for fixtures:', runId);

  alice = {
    username: 'alice-user-' + runId,
    password: 'aula',
    displayName: 'alice-' + runId,
    realName: 'Alice Testing' + runId,
    role: 20,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  bob = {
    username: 'bob-user-' + runId,
    password: 'aula',
    displayName: 'bob-' + runId,
    realName: 'Bob Testing' + runId,
    role: 20,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  mallory = {
    username: 'mallory-moderator_v-' + runId,
    password: 'aula',
    displayName: 'mallory-' + runId,
    realName: 'mallory Testing' + runId,
    role: 41,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  burt = {
    username: 'burt-supermoderator_v-' + runId,
    password: 'aula',
    displayName: 'burt-' + runId,
    realName: 'burt Testing' + runId,
    role: 41,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  rainer = {
    username: 'rainer-principal_v-' + runId,
    password: 'aula',
    displayName: 'rainer-' + runId,
    realName: 'rainer Testing' + runId,
    role: 45,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };
};

// Define test users with proper typing
export const testUsers = {
  alice: () => alice,
  bob: () => bob,
  mallory: () => mallory,
  burt: () => burt,
  rainer: () => rainer,
} as const;

export type TestUserKey = keyof typeof testUsers;

const userKeys = Object.keys(testUsers) as Array<TestUserKey>;

export const generateBaseUsers = async (): Promise<boolean> => {
  if (!alice) init();

  try {
    await browsers.init();
    await userInteractions.login(browsers.admin, admin);

    // Map user keys to their corresponding browser pages (after browsers are initialized)
    const browserMap = {
      alice: browsers.alice,
      bob: browsers.bob,
      mallory: browsers.mallory,
      burt: browsers.burt,
      rainer: browsers.rainer,
    } as const;

    // Sequential user creation to avoid race conditions
    for (const userKey of userKeys) {
      const user = testUsers[userKey]();
      const tempPassword = await userInteractions.create(browsers.admin, user);

      if (!tempPassword) {
        console.error('❌ Failed to create user:', user.username);
        return false;
      }

      // Run first login flow with the correct browser page
      const userBrowser = browserMap[userKey];
      if (userBrowser) {
        await userInteractions.firstLoginFlow(userBrowser, user, tempPassword);
        console.log('✅ Created user:', user.username);
      } else {
        console.error('❌ No browser found for user:', userKey);
        return false;
      }
    }

    console.log('✅ All users created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error generating base users:', error);
    return false;
  }
};

export const clearBaseUsers = async (): Promise<boolean> => {
  if (!alice) return true;

  try {
    await browsers.init();
    await userInteractions.login(browsers.admin, admin);

    let allRemoved = true;

    // Sequential user removal to avoid race conditions
    for (const userKey of userKeys) {
      const user = testUsers[userKey]();

      try {
        await userInteractions.remove(browsers.admin, user);
        console.log('✅ Removed user:', user.username);
      } catch (error) {
        console.error('❌ Failed to remove user:', user.username, error);
        allRemoved = false;
        // Continue with other users instead of failing completely
      }
    }

    if (allRemoved) {
      console.log('✅ All users removed successfully');
    } else {
      console.warn('⚠️ Some users could not be removed');
    }

    return allRemoved;
  } catch (error) {
    console.error('❌ Error cleaning base users:', error);
    return false;
  }
};
