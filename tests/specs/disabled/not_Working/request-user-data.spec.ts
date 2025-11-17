import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../lifecycle/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { RequestUserDataTestHelpers, RequestUserDataTestContext } from '../../shared/helpers/request-user-data';

// Test constants for better maintainability
const TEST_USERS = {
  REQUESTER: 'alice',
  ADMIN: 'admin',
} as const;

const EXPORT_CONFIG = {
  FILE_PREFIX: 'data_export',
  EXPECTED_MIME_TYPES: ['application/zip', 'application/json'],
  MAX_DOWNLOAD_TIMEOUT: 30000,
} as const;

describeWithSetup('Request user data flow', () => {
  // Shared context for sequential tests
  let sharedContext: RequestUserDataTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: RequestUserDataTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext) {
      const admin = await BrowserHelpers.openPageForUser('admin');
      try {
        await RequestUserDataTestHelpers.cleanupTestData(admin, sharedContext);
      } catch (e) {
        console.warn('Shared context cleanup failed:', e);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    }

    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await RequestUserDataTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test('Alice can request user data export', async () => {
    const alice = await BrowserHelpers.openPageForUser(TEST_USERS.REQUESTER);

    try {
      // Initialize shared context for the test suite
      sharedContext = await RequestUserDataTestHelpers.setupRequestUserDataTest();
      expect(sharedContext, 'Test context should be initialized successfully').toBeDefined();

      await RequestUserDataTestHelpers.requestDataExport(alice, sharedContext);
      expect(sharedContext.isRequestCreated, 'Data export request should be created successfully').toBe(true);
    } catch (error) {
      console.error('Failed to create data export request:', error);
      throw new Error(`Data export request creation failed for user: ${TEST_USERS.REQUESTER}`);
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('Admin can approve the data export request', async () => {
    const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

    try {
      expect(sharedContext, 'Shared context should exist from previous test').toBeTruthy();
      expect(sharedContext!.isRequestCreated, 'Data export request should have been created in previous test').toBe(
        true
      );

      await RequestUserDataTestHelpers.approveDataExportRequest(admin, TEST_USERS.REQUESTER, sharedContext!);
      expect(sharedContext!.isRequestApproved, 'Data export request should be approved successfully').toBe(true);
    } catch (error) {
      console.error('Failed to approve data export request:', error);
      console.error('Page URL:', admin.url());

      // Take a screenshot for debugging
      try {
        await admin.screenshot({ path: 'debug-admin-approval-failure.png', fullPage: true });
      } catch (screenshotError) {
        console.error('Could not take screenshot:', screenshotError);
      }

      throw new Error(
        `Admin approval failed. Prerequisites: requestCreated=${!!sharedContext?.isRequestCreated}. Original error: ${error}`
      );
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Alice can see the approval and download her data', async () => {
    const alice = await BrowserHelpers.openPageForUser(TEST_USERS.REQUESTER);

    try {
      expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
      expect(sharedContext!.isRequestCreated, 'Data export request should have been created').toBe(true);
      expect(sharedContext!.isRequestApproved, 'Data export request should have been approved by admin').toBe(true);

      await RequestUserDataTestHelpers.downloadUserData(alice, TEST_USERS.REQUESTER, sharedContext!);

      expect(
        sharedContext!.downloadFilename,
        'Download filename should be set after successful download'
      ).toBeDefined();
      expect(
        sharedContext!.downloadFilename,
        `Downloaded file should contain expected prefix: ${EXPORT_CONFIG.FILE_PREFIX}`
      ).toContain(EXPORT_CONFIG.FILE_PREFIX);

      // Additional validation that download was successful
      expect(typeof sharedContext!.downloadFilename, 'Download filename should be a string').toBe('string');
      expect(sharedContext!.downloadFilename!.length, 'Download filename should not be empty').toBeGreaterThan(0);
    } catch (error) {
      console.error('Failed to download user data:', error);
      throw new Error(
        `Data download failed. Prerequisites: requestCreated=${!!sharedContext?.isRequestCreated}, requestApproved=${!!sharedContext?.isRequestApproved}`
      );
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });
});
