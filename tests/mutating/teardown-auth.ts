// called from playwright.config
import * as userData from '../fixtures/users';
import { TestCleanup } from '../shared/cleanup';
import * as browsers from '../shared/interactions/browsers';
import { createTestApiClient } from '../shared/helpers/api-calls';

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
    // Get admin browser (should have saved session from setup)
    const adminPage = await browsers.getUserBrowser('admin');
    if (!adminPage) {
      console.warn('⚠️ Admin browser not available for cleanup');
      return false;
    }

    // Create API client with admin page context (uses authenticated session)
    const apiClient = createTestApiClient(adminPage);
    console.log('✅ Using admin session for cleanup');

    // Get the same users that were created in setup
    const usersToRemove = userData.all();
    console.log('👥 Users to remove:', Object.keys(usersToRemove));

    if (Object.keys(usersToRemove).length === 0) {
      console.log('ℹ️ No users found in userData.all() to remove');
      return true;
    }

    // Get all users from the system to find their IDs
    const allUsers = await apiClient.getUsers();
    let allRemoved = true;

    // Remove users that were created in setup
    for (const [userKey, user] of Object.entries(usersToRemove)) {
      try {
        console.log(`🗑️ Attempting to remove user: ${user.username} (key: ${userKey})`);

        // Find user ID from the system
        const systemUser = (allUsers as any[]).find((u: any) => u.username === user.username);

        if (systemUser?.hash_id) {
          await apiClient.deleteUser(systemUser.hash_id);
          console.log(`✅ Successfully removed user: ${user.username}`);
        } else {
          console.warn(`⚠️ User not found in system: ${user.username}`);
        }
      } catch (error) {
        console.error(`❌ Failed to remove user ${user.username}:`, error);
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
