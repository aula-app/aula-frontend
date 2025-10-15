// called from playwright.config
import * as userData from '../fixtures/users';
import { TestCleanup } from '../shared/cleanup';
import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users';

export default async function globalTeardown() {
  // Comprehensive cleanup of test artifacts
  console.log('Cleaning up after all tests...');

  userData.init();
  await clearBaseUsers();
  await browsers.shutdown();

  try {
    await TestCleanup.cleanupAll();
    console.info('✅ Test artifacts cleaned up successfully');
  } catch (error) {
    console.warn('⚠️ Some cleanup operations failed:', error);
  }
}

export const clearBaseUsers = async (): Promise<boolean> => {
  await browsers.recall();

  try {
    let allRemoved = true;
    const adminPage = await browsers.getUserBrowser('admin');
    if (!adminPage) {
      throw new Error('Admin browser not available for user cleanup.');
    }

    const users = userData.all();
    console.log('👥 Users to remove:', Object.keys(users));

    // Sequential user removal to avoid race conditions
    for (const [userKey, user] of Object.entries(users)) {
      try {
        console.log(`🗑️ Attempting to remove user: ${user.username} (key: ${userKey})`);
        await userInteractions.remove(adminPage, user);
      } catch (error) {
        allRemoved = false;
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
