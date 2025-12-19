import { expect } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';

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
      await navigation.goToProfile(userPage);

      // Open the danger panel accordion
      await navigation.openAccordion(userPage, 'privacy-panel-button');

      // Click the request data export button
      await formInteractions.clickButton(userPage, 'request-data-export-button');
      await userPage.waitForLoadState('networkidle');

      const confirmationMessage = userPage.getByRole('alert').getByTestId('SuccessOutlinedIcon');
      await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
    });
  });

  test('Admin can approve the data export request', async ({ adminPage, userConfig }) => {
    await test.step('Navigate to requests settings', async () => {
      await navigation.goToRequestsSettings(adminPage);
      const requestRow = adminPage.getByTestId(`data-export-request-${userConfig.username}`);
      await expect(requestRow).toBeVisible();
    });

    await test.step('Approve the export request', async () => {
      await navigation.goToRequestsSettings(adminPage);

      // Find the request for the specific user
      const requestRow = adminPage.getByTestId(`data-export-request-${userConfig.username}`);
      await expect(requestRow).toBeVisible({ timeout: 5000 });

      // Click approve button
      const approveButton = requestRow.getByTestId('confirm-request');
      await expect(approveButton).toBeVisible({ timeout: 5000 });
      await approveButton.click();

      // Wait for confirmation dialog
      await adminPage.getByTestId('confirm-request-dialog').waitFor({ state: 'visible', timeout: 5000 });

      // Click confirm button in the dialog
      await formInteractions.clickButton(adminPage, 'confirm-request-action');
      await adminPage.waitForLoadState('networkidle');
    });
  });

  test('User can see the approval and download their data', async ({ userPage, userConfig }) => {
    await test.step('Download user data', async () => {
      await navigation.goToMessages(userPage);

      // Click on the data export message (find by headline text)
      const exportMessage = userPage.getByText(userConfig.displayName).first();
      await expect(exportMessage).toBeVisible({ timeout: 5000 });
      await exportMessage.click();
      await userPage.waitForLoadState('networkidle');

      // // Verify download button is available
      const downloadButton = userPage.getByTestId('download-data-button');
      await expect(downloadButton).toBeVisible({ timeout: 5000 });
      await expect(downloadButton).toBeEnabled();

      // Setup download listener
      const downloadPromise = userPage.waitForEvent('download', { timeout: 30000 });
      await downloadButton.click();

      // Wait for download to complete
      const download = await downloadPromise;
      const filename = download.suggestedFilename();

      expect(filename).toBeDefined();
      expect(filename).toContain('data_export');
    });
  });
});
