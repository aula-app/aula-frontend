import * as formInteractions from '../../interactions/forms';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as navigation from '../../interactions/navigation';

/**
 * Request User Data Flow Tests
 * Tests the complete flow of requesting, approving, and downloading user data export
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. User requests data export → 2. Admin approves request → 3. User downloads data
 */
test('Request User Data - Export Request and Download Flow', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  await test.step('User can request user data export', async () => {
    await navigation.goToProfile(userPage);

    // Open the danger panel accordion
    await navigation.openAccordion(userPage, 'privacy-panel-button');

    // Click the request data export button
    await formInteractions.clickButton(userPage, 'request-data-export-button');
    await expect(userPage.getByTestId('success-alert')).toBeVisible();
  });

  await test.step('Admin can approve the data export request', async () => {
    // Find the request for the specific user
    await navigation.goToRequestsSettings(adminPage);
    const requestRow = adminPage.getByTestId(`data-export-request-${seededUser.username}`);
    await expect(requestRow).toBeVisible();

    // Click approve button
    const approveButton = requestRow.getByTestId('confirm-request');
    await expect(approveButton).toBeVisible();
    await approveButton.click();

    // Wait for confirmation dialog
    await adminPage.getByTestId('confirm-request-dialog').waitFor({ state: 'visible' });

    // Click confirm button in the dialog
    await formInteractions.clickButton(adminPage, 'confirm-request-action');
    await adminPage.getByTestId('confirm-request-dialog').waitFor({ state: 'hidden' });
  });

  await test.step('User can see the approval and download their data', async () => {
    await navigation.goToMessages(userPage);
    const messagesView = userPage.getByTestId('user-messages-view');
    await expect(messagesView).toBeVisible();

    // Click on the data export message (find by headline text)
    const exportMessage = messagesView.getByText(seededUser.displayName).first();
    await expect(exportMessage).toBeVisible();
    await exportMessage.click();

    // Click on the Download button
    const downloadButton = userPage.getByTestId('download-data-button');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Wait for download to complete
    const download = await userPage.waitForEvent('download');
    const filename = download.suggestedFilename();

    expect(filename).toBeDefined();
    expect(filename).toContain('data_export');

    // @TODO: Verify the content of the downloaded data export
  });
});
