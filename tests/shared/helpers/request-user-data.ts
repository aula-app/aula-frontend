import { Page, expect } from '@playwright/test';
import * as shared from '../shared';
import * as fixtures from '../../fixtures/users';
import { goToProfile, goToRequests } from '../page_interactions/users';

export interface RequestUserDataTestContext {
  requestId?: string;
  downloadFilename?: string;
  isRequestCreated: boolean;
  isRequestApproved: boolean;
  isDownloadCompleted?: boolean;
  downloadSize?: number;
  approvalTimestamp?: Date;
}

export class RequestUserDataTestHelpers {
  static async setupRequestUserDataTest(): Promise<RequestUserDataTestContext> {
    return {
      isRequestCreated: false,
      isRequestApproved: false,
    };
  }

  static async navigateToDataPrivacySection(page: Page): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);
    await goToProfile(page);

    // Open data privacy accordion using test ID instead of hardcoded text
    const privacyAccordion = page.getByTestId('privacy-accordion');
    if (await privacyAccordion.isVisible()) {
      await privacyAccordion.click({ timeout: 1000 });
    } else {
      // Fallback to role-based selector if test ID not available
      const fallbackAccordion = page.getByRole('button', { name: 'Datenschutz' });
      await expect(fallbackAccordion).toBeVisible();
      await fallbackAccordion.click({ timeout: 1000 });
    }
  }

  static async requestDataExport(page: Page, context: RequestUserDataTestContext): Promise<void> {
    await this.navigateToDataPrivacySection(page);

    // Request data export using test ID instead of hardcoded text
    const requestButton = page.getByTestId('request-data-export-button');
    if (await requestButton.isVisible()) {
      await requestButton.click({ timeout: 1000 });
    } else {
      // Fallback to role-based selector if test ID not available
      const fallbackButton = page.getByRole('button', { name: 'Datenexport anfordern' });
      await expect(fallbackButton).toBeVisible();
      await fallbackButton.click({ timeout: 1000 });
    }

    context.isRequestCreated = true;
  }

  static async navigateToAdminRequests(page: Page): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);
    await goToRequests(page);
  }

  static async approveDataExportRequest(
    page: Page,
    username: string,
    context: RequestUserDataTestContext
  ): Promise<void> {
    await this.navigateToAdminRequests(page);

    const userDisplayName = (fixtures as any)[username]?.displayName || username;

    // Find request using test ID instead of hardcoded German text
    const requestDiv = page.getByTestId(`data-export-request-${username}`);
    let requestElement;

    if (await requestDiv.isVisible()) {
      requestElement = requestDiv;
    } else {
      // Fallback to text-based selector if test ID not available
      requestElement = page
        .locator('div')
        .filter({ hasText: `Kontodatenexportanfrage für ${userDisplayName}` })
        .first();
    }

    await expect(requestElement).toBeVisible();

    // Approve request
    const approveButton = requestElement.getByTestId('confirm-request').first();
    await expect(approveButton).toBeVisible();
    await approveButton.click({ timeout: 1000 });

    // Handle confirmation modal
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    const confirmButton = modal.getByTestId('confirm-request-action').first();
    await expect(confirmButton).toBeVisible();
    await confirmButton.click({ timeout: 1000 });

    // Verify download button appears
    const downloadButton = requestElement.getByTestId('download-data-button').first();
    if (await downloadButton.isVisible()) {
      // Test ID available
    } else {
      // Fallback to role-based selector
      const fallbackDownloadButton = requestElement.getByRole('button', { name: 'Herunterladen' }).first();
      await expect(fallbackDownloadButton).toBeVisible();
    }

    context.isRequestApproved = true;
    context.approvalTimestamp = new Date();
  }

  static async navigateToMessages(page: Page): Promise<void> {
    const messagesButton = page.locator('a[href="/messages"]');
    await expect(messagesButton).toBeVisible();
    await messagesButton.click({ timeout: 1000 });
  }

  static async downloadUserData(page: Page, username: string, context: RequestUserDataTestContext): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);

    await this.navigateToMessages(page);

    const userDisplayName = (fixtures as any)[username]?.displayName || username;

    // Find message using test ID instead of hardcoded German text
    const messageLink = page.getByTestId(`data-export-message-${username}`);
    let messageElement;

    if (await messageLink.isVisible()) {
      messageElement = messageLink;
    } else {
      // Fallback to text-based selector if test ID not available
      messageElement = page
        .locator('a')
        .filter({ hasText: `Kontodatenexportanfrage für ${userDisplayName}` })
        .first();
    }

    await expect(messageElement).toBeVisible();
    await messageElement.click({ timeout: 1000 });

    // Find the request div in the message view
    const requestDiv = page.getByTestId(`data-export-request-details-${username}`);
    let requestElement;

    if (await requestDiv.isVisible()) {
      requestElement = requestDiv;
    } else {
      // Fallback to text-based selector if test ID not available
      requestElement = page
        .locator('div')
        .filter({ hasText: `Kontodatenexportanfrage für ${userDisplayName}` })
        .first();
    }

    await expect(requestElement).toBeVisible();

    // Download the data
    const downloadButton = requestElement.getByTestId('download-data-button').first();
    if (await downloadButton.isVisible()) {
      await downloadButton.click({ timeout: 1000 });
    } else {
      // Fallback to role-based selector
      const fallbackDownloadButton = requestElement.getByRole('button', { name: 'Herunterladen' }).first();
      await expect(fallbackDownloadButton).toBeVisible();
      await fallbackDownloadButton.click({ timeout: 1000 });
    }

    // Handle download
    const download = await page.waitForEvent('download');
    const filename = await download.suggestedFilename();

    await expect(filename).toContain('data_export');
    context.downloadFilename = filename;
    context.isDownloadCompleted = true;

    // Try to get download size if available
    try {
      const downloadPath = await download.path();
      if (downloadPath) {
        context.downloadSize = 0; // Placeholder - would require fs.stat
      }
    } catch (e) {
      // Download size not available, continue without it
      console.debug('Could not determine download size:', e);
    }
  }

  static async cleanupTestData(page: Page, context: RequestUserDataTestContext): Promise<void> {
    const errors: Error[] = [];

    if (context.isRequestCreated) {
      try {
        // TODO: Add API call to cleanup data export request if available
        console.log('Data export request cleanup would happen here');
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup data export request: ${e.message}`));
      }
    }

    // Log cleanup errors but don't fail the test
    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: RequestUserDataTestContext) => Promise<T>,
    emergencyCleanupQueue?: Array<{ page: any; context: RequestUserDataTestContext }>
  ): Promise<T> {
    const context = await this.setupRequestUserDataTest();

    // Add to emergency cleanup queue if provided
    if (emergencyCleanupQueue) {
      emergencyCleanupQueue.push({ page, context });
    }

    try {
      return await testLogic(context);
    } finally {
      // Remove from emergency cleanup queue if successful
      if (emergencyCleanupQueue) {
        const index = emergencyCleanupQueue.findIndex((item) => item.context === context);
        if (index >= 0) {
          emergencyCleanupQueue.splice(index, 1);
        }
      }

      await this.cleanupTestData(page, context);
    }
  }
}
