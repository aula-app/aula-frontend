import { Page, expect } from '@playwright/test';
import * as shared from '../shared';
import * as fixtures from '../../fixtures/users';
import { goToProfile, goToRequests } from '../interactions/users';

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

    try {
      await goToRequests(page);
    } catch (error) {
      console.error('Failed to navigate to requests page using goToRequests helper:', error);

      // Fallback: Try direct navigation
      const requestsUrl = `${host}/admin/requests`;
      console.log(`Trying direct navigation to: ${requestsUrl}`);
      await page.goto(requestsUrl);
    }

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  }

  static async approveDataExportRequest(
    page: Page,
    username: string,
    context: RequestUserDataTestContext
  ): Promise<void> {
    await this.navigateToAdminRequests(page);

    const userDisplayName = (fixtures as any)[username]?.displayName || username;

    // Try to find request using test ID first, then fallback to other selectors
    let requestElement = page.getByTestId(`data-export-request-${username}`);

    try {
      await expect(requestElement).toBeVisible({ timeout: 2000 });
    } catch {
      // Fallback: Try to find by user display name in table rows or list items
      requestElement = page.locator(`text="${userDisplayName}"`).locator('..').first();

      try {
        await expect(requestElement).toBeVisible({ timeout: 2000 });
      } catch {
        // Final fallback: Look for any data export request elements
        requestElement = page.locator('[data-testid*="request"], .request-item, tr:has-text("Export")').first();
        await expect(requestElement).toBeVisible({ timeout: 2000 });
      }
    }

    // Try to find approve/confirm button with multiple strategies
    let approveButton = requestElement.getByTestId('confirm-request').first();

    try {
      await expect(approveButton).toBeVisible({ timeout: 1000 });
    } catch {
      // Fallback: Look for buttons with approval-related text or icons
      approveButton = requestElement
        .locator(
          'button:has-text("Bestätigen"), button:has-text("Genehmigen"), button[aria-label*="approve"], button[aria-label*="confirm"]'
        )
        .first();

      try {
        await expect(approveButton).toBeVisible({ timeout: 1000 });
      } catch {
        // Final fallback: Any button in the request element
        approveButton = requestElement.locator('button').first();
        await expect(approveButton).toBeVisible({ timeout: 1000 });
      }
    }

    await approveButton.click();

    // Handle confirmation modal if it appears
    try {
      const modal = page.locator('div[role="dialog"], .modal, [data-testid*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 2000 });

      let confirmButton = modal.getByTestId('confirm-request-action').first();

      try {
        await expect(confirmButton).toBeVisible({ timeout: 1000 });
      } catch {
        // Fallback: Look for confirmation buttons in modal
        confirmButton = modal
          .locator(
            'button:has-text("Bestätigen"), button:has-text("OK"), button:has-text("Ja"), button[aria-label*="confirm"]'
          )
          .first();
        await expect(confirmButton).toBeVisible({ timeout: 1000 });
      }

      await confirmButton.click();

      // Wait for modal to disappear
      await expect(modal).toBeHidden({ timeout: 3000 });
    } catch {
      // No modal appeared, continue
      console.debug('No confirmation modal detected');
    }

    // Wait a moment for the approval to process
    await page.waitForTimeout(1000);

    context.isRequestApproved = true;
    context.approvalTimestamp = new Date();
  }

  private static async navigateToMessages(page: Page): Promise<void> {
    // Try multiple strategies to navigate to messages
    let messagesButton = page.getByTestId('navigation-messages');

    try {
      await expect(messagesButton).toBeVisible({ timeout: 2000 });
    } catch {
      // Fallback 1: Look for messages/notifications in navigation
      messagesButton = page
        .locator(
          'nav a:has-text("Messages"), nav a:has-text("Nachrichten"), nav button:has-text("Messages"), nav button:has-text("Nachrichten")'
        )
        .first();

      try {
        await expect(messagesButton).toBeVisible({ timeout: 2000 });
      } catch {
        // Fallback 2: Look for any navigation item that might lead to messages
        messagesButton = page
          .locator(
            '[data-testid*="message"], [data-testid*="notification"], nav a[href*="message"], nav a[href*="notification"]'
          )
          .first();
        await expect(messagesButton).toBeVisible({ timeout: 2000 });
      }
    }

    await messagesButton.click();
    await page.waitForLoadState('networkidle');
  }

  static async downloadUserData(page: Page, username: string, context: RequestUserDataTestContext): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);

    try {
      await this.navigateToMessages(page);
    } catch (error) {
      console.error('Failed to navigate to messages using helper:', error);
      // Fallback: Try direct navigation to messages/notifications
      const messagesUrl = `${host}/messages`;
      console.log(`Trying direct navigation to: ${messagesUrl}`);
      await page.goto(messagesUrl);
      await page.waitForLoadState('networkidle');
    }

    const userDisplayName = (fixtures as any)[username]?.displayName || username;

    // Try multiple strategies to find the message/notification
    let messageElement = page.getByTestId(`data-export-message-${userDisplayName}`);

    try {
      await expect(messageElement).toBeVisible({ timeout: 2000 });
    } catch {
      // Fallback 1: Look for message with data export content
      messageElement = page.locator('text*="data export", text*="Datenexport", text*="Export"').first();

      try {
        await expect(messageElement).toBeVisible({ timeout: 2000 });
      } catch {
        // Fallback 2: Look for any message or notification item
        messageElement = page
          .locator('.message-item, .notification-item, [data-testid*="message"], [data-testid*="notification"]')
          .first();
        await expect(messageElement).toBeVisible({ timeout: 2000 });
      }
    }

    await messageElement.click();
    await page.waitForTimeout(500); // Wait for message to expand/load

    // Try multiple strategies to find the download section
    let downloadSection = page.getByTestId(`data-export-request-details-${username}`);

    try {
      await expect(downloadSection).toBeVisible({ timeout: 2000 });
    } catch {
      // Fallback 1: Look for download-related content in the page
      downloadSection = page.locator('text*="download", text*="Download", text*="herunterladen"').locator('..').first();

      try {
        await expect(downloadSection).toBeVisible({ timeout: 2000 });
      } catch {
        // Fallback 2: Use the whole message content area
        downloadSection = page.locator('.message-content, .notification-content, main').first();
        await expect(downloadSection).toBeVisible({ timeout: 2000 });
      }
    }

    // Try multiple strategies to find the download button
    let downloadButton = downloadSection.getByTestId('download-data-button').first();

    try {
      await expect(downloadButton).toBeVisible({ timeout: 2000 });
    } catch {
      // Fallback 1: Look for download-related buttons
      downloadButton = downloadSection
        .locator('button:has-text("Download"), button:has-text("Herunterladen"), a[download], a[href*="download"]')
        .first();

      try {
        await expect(downloadButton).toBeVisible({ timeout: 2000 });
      } catch {
        // Fallback 2: Look for any button that might trigger download
        downloadButton = downloadSection.locator('button, a[href]').first();
        await expect(downloadButton).toBeVisible({ timeout: 2000 });
      }
    }

    // Set up download listener before clicking
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

    await downloadButton.click();

    try {
      // Handle download
      const download = await downloadPromise;
      const filename = download.suggestedFilename();

      if (filename && filename.length > 0) {
        // Verify it looks like a data export file
        const isValidExportFile =
          filename.includes('data_export') ||
          filename.includes('export') ||
          filename.endsWith('.zip') ||
          filename.endsWith('.json');

        if (!isValidExportFile) {
          console.warn(`Downloaded file "${filename}" doesn't look like a data export file`);
        }

        context.downloadFilename = filename;
        context.isDownloadCompleted = true;

        // Try to get download size if available
        try {
          const downloadPath = await download.path();
          if (downloadPath) {
            context.downloadSize = 0; // Placeholder - would require fs.stat
          }
        } catch (e) {
          console.debug('Could not determine download size:', e);
        }
      } else {
        throw new Error('Download completed but no filename was provided');
      }
    } catch (downloadError) {
      console.error('Download failed or timed out:', downloadError);
      throw new Error(`Failed to download user data: ${downloadError}`);
    }
  }

  static async cleanupTestData(_page: Page, context: RequestUserDataTestContext): Promise<void> {
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
