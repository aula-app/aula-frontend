import { expect } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as requestUserData from '../../interactions/request-user-data';

/**
 * Request User Data Flow Tests
 * Tests the complete flow of requesting, approving, and downloading user data export
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. User requests data export → 2. Admin approves request → 3. User downloads data
 */
test.describe.serial('Request User Data - Export Request and Download Flow', () => {
  test('User can request user data export', async ({ userPage }) => {
    await test.step('Submit data export request', async () => {
      await requestUserData.requestDataExport(userPage);
    });
  });

  test('Admin can approve the data export request', async ({ adminPage, userConfig }) => {
    await test.step('Navigate to requests settings', async () => {
      await requestUserData.verifyRequestExists(adminPage, userConfig.username);
    });

    await test.step('Approve the export request', async () => {
      await requestUserData.approveDataExportRequest(adminPage, userConfig.username);
    });
  });

  test('User can see the approval and download their data', async ({ userPage, userConfig }) => {
    await test.step('Download user data', async () => {
      await requestUserData.downloadUserData(userPage, userConfig.displayName.replace(/\s+/g, '-'));
    });
  });
});
