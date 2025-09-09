import { chromium, test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { InstanceOfflineTestHelpers, InstanceOfflineTestContext } from '../../shared/helpers/instance-offline';
import * as fixtures from '../../fixtures/users';

describeWithSetup('Instance Offline Mode', () => {
  // Track cleanup contexts for emergency cleanup
  const cleanupQueue: Array<{ page: any; context: InstanceOfflineTestContext }> = [];

  test.afterAll(async () => {
    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await InstanceOfflineTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test('Instance offline workflow: Admin controls access and users experience proper offline/online states', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');
    let userBrowser: any = null;
    let userContext: any = null;
    let user: any = null;

    try {
      await InstanceOfflineTestHelpers.executeWithCleanup(
        admin,
        async (context) => {
          // ===== STEP 1: Admin sets instance offline =====
          await InstanceOfflineTestHelpers.navigateToSystemSettings(admin);

          const currentStatus = await InstanceOfflineTestHelpers.getCurrentInstanceStatus(admin);
          context.originalStatus = currentStatus;
          context.currentStatus = currentStatus;

          await InstanceOfflineTestHelpers.setInstanceStatus(admin, 'inactive');
          context.currentStatus = 'inactive';

          // ===== STEP 2: User cannot login when instance is offline =====
          userBrowser = await chromium.launch();
          userContext = await userBrowser.newContext();
          user = await userContext.newPage();

          await InstanceOfflineTestHelpers.attemptUserLogin(user, fixtures.alice.username, fixtures.alice.password);
          await InstanceOfflineTestHelpers.verifyOfflineView(user);

          // Cleanup user browser
          await user.close();
          await userContext.close();
          await userBrowser.close();
          userBrowser = null;

          // ===== STEP 3: Admin sets instance back online =====
          await InstanceOfflineTestHelpers.navigateToSystemSettings(admin);
          await InstanceOfflineTestHelpers.setInstanceStatus(admin, 'active');
          context.currentStatus = 'active';

          // ===== STEP 4: User can login again after instance is restored =====
          userBrowser = await chromium.launch();
          userContext = await userBrowser.newContext();
          user = await userContext.newPage();

          await InstanceOfflineTestHelpers.verifyUserCanLogin(user, fixtures.alice.username, fixtures.alice.password);

          // Cleanup user browser
          await user.close();
          await userContext.close();
          await userBrowser.close();
          userBrowser = null;
        },
        cleanupQueue
      );
    } catch (error) {
      console.error('Instance offline workflow test failed:', error);
      throw error;
    } finally {
      // Cleanup user browser if it wasn't cleaned up properly
      if (user) await user.close();
      if (userContext) await userContext.close();
      if (userBrowser) await userBrowser.close();

      await BrowserHelpers.closePage(admin);
    }
  });
});
