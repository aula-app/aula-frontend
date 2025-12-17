import { expect, Page } from '@playwright/test';
import * as formInteractions from './forms';
import * as navigation from './navigation';

/**
 * Request user data export from profile settings
 */
export const requestDataExport = async (page: Page) => {
  await navigation.goToProfile(page);

  // Open the danger panel accordion
  await navigation.openAccordion(page, 'privacy-panel-button');

  // Click the request data export button
  await formInteractions.clickButton(page, 'request-data-export-button');
  await page.waitForLoadState('networkidle');

  // Verify request was created (look for success message)
  // EN: "Data change procedure requested. Please wait for approval."
  // DE: "Datenänderungsprozedur angefordert. Bitte warten Sie auf die Genehmigung."
  const confirmationMessage = page.getByText(
    /(data change procedure requested|datenänderungsprozedur angefordert|please wait for approval|bitte warten sie auf die genehmigung)/i
  );
  await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
};

/**
 * Approve a user data export request as admin
 */
export const approveDataExportRequest = async (page: Page, username: string) => {
  await navigation.goToRequestsSettings(page);

  // Find the request for the specific user
  const requestRow = page.getByTestId(`data-export-request-${username}`);
  await expect(requestRow).toBeVisible({ timeout: 5000 });

  // Click approve button
  const approveButton = requestRow.getByTestId('confirm-request');
  await expect(approveButton).toBeVisible({ timeout: 5000 });
  await approveButton.click();

  // Wait for confirmation dialog
  await page.getByTestId('confirm-request-dialog').waitFor({ state: 'visible', timeout: 5000 });

  // Click confirm button in the dialog
  await formInteractions.clickButton(page, 'confirm-request-action');
  await page.waitForLoadState('networkidle');
};

/**
 * Verify that a data export request exists for a user
 */
export const verifyRequestExists = async (page: Page, username: string) => {
  await navigation.goToRequestsSettings(page);
  const requestRow = page.getByTestId(`data-export-request-${username}`);
  await expect(requestRow).toBeVisible();
};

/**
 * Verify that a data export is ready for download
 */
export const downloadUserData = async (page: Page, username: string) => {
  await navigation.goToMessages(page);

  // Click on the data export message
  const exportMessage = page.getByTestId(`data-export-message-${username}`);
  await expect(exportMessage).toBeVisible({ timeout: 5000 });
  await exportMessage.click();
  await page.waitForLoadState('networkidle');

  // // Verify download button is available
  const downloadButton = page.getByTestId('download-data-button');
  await expect(downloadButton).toBeVisible({ timeout: 5000 });
  await expect(downloadButton).toBeEnabled();

  // Setup download listener
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await downloadButton.click();

  // Wait for download to complete
  const download = await downloadPromise;
  const filename = download.suggestedFilename();

  expect(filename).toBeDefined();
  expect(filename).toContain('data_export');
};
