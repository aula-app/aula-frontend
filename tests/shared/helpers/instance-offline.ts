import { Page } from '@playwright/test';
import * as shared from '../shared';
import * as users from '../interactions/users';
import * as fixtures from '../../fixtures/users';

export interface InstanceOfflineTestContext {
  originalStatus: 'active' | 'inactive';
  currentStatus: 'active' | 'inactive';
}

export class InstanceOfflineTestHelpers {
  static async setupInstanceOfflineTest(): Promise<InstanceOfflineTestContext> {
    return {
      originalStatus: 'active',
      currentStatus: 'active',
    };
  }

  static async navigateToSystemSettings(page: Page): Promise<void> {
    await users.goToSystemConfig(page);
    await page.getByTestId('config-accordion-system').waitFor({ state: 'visible' });
    await page.getByTestId('config-accordion-system').click();
  }

  static async getCurrentInstanceStatus(page: Page): Promise<'active' | 'inactive'> {
    const statusSelector = page.getByTestId('system-status-selector');
    await statusSelector.waitFor({ state: 'visible' });

    // For TextField with select, we need to get the input element inside it
    const inputElement = statusSelector.locator('input');
    const selectedValue = await inputElement.getAttribute('value');

    return selectedValue === '1' ? 'active' : 'inactive';
  }

  static async setInstanceStatus(page: Page, status: 'active' | 'inactive'): Promise<void> {
    const statusSelector = page.getByTestId('system-status-selector');
    await statusSelector.waitFor({ state: 'visible' });

    await statusSelector.click();

    const optionTestId = status === 'active' ? 'status-option-status.active' : 'status-option-status.inactive';
    await page.getByTestId(optionTestId).click();

    const confirmButton = page.getByTestId('system-settings-confirm-button');
    await confirmButton.waitFor({ state: 'visible' });
    await confirmButton.click();

    // Wait for the operation to complete
    await page.waitForTimeout(1000);
  }

  static async verifyOfflineView(page: Page): Promise<void> {
    // Wait for the offline view to be displayed
    await page.getByTestId('school-offline-view').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByTestId('school-offline-image').waitFor({ state: 'visible' });
    await page.getByTestId('school-offline-message').waitFor({ state: 'visible' });
  }

  static async verifyUserCanLogin(page: Page, username: string, password: string): Promise<void> {
    await this.attemptUserLogin(page, username, password);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify user is NOT seeing the offline view
    const offlineView = page.getByTestId('school-offline-view');
    try {
      await offlineView.waitFor({ state: 'detached', timeout: 3000 });
    } catch (e) {
      // If it's still there, check if it's hidden
      const isVisible = await offlineView.isVisible().catch(() => false);
      if (isVisible) {
        throw new Error('User is still seeing the offline view after login attempt');
      }
    }

    // Verify user successfully reached the main application
    // Look for common elements that indicate successful login
    const indicators = [
      page.locator('main, [role="main"]').first(),
      page.locator('[data-testid*="navigation"], [data-testid*="nav"]').first(),
      page.locator('[data-testid*="user-menu"], [data-testid*="profile"]').first(),
      page.locator('#root > div').first(),
    ];

    let loginSuccessful = false;
    for (const indicator of indicators) {
      try {
        await indicator.waitFor({ state: 'visible', timeout: 5000 });
        loginSuccessful = true;
        break;
      } catch (e) {
        // Continue to next indicator
      }
    }

    if (!loginSuccessful) {
      throw new Error('Could not verify successful login - no main content indicators found');
    }
  }

  static async attemptUserLogin(page: Page, username: string, password: string): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);

    const usernameField = page.locator('input[name="username"]');
    const passwordField = page.locator('input[name="password"]');
    const loginButton = page.getByRole('button', { name: /login/i });

    await usernameField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();
  }

  static async restoreInstanceStatus(page: Page, context: InstanceOfflineTestContext): Promise<void> {
    if (context.currentStatus !== context.originalStatus) {
      try {
        await this.navigateToSystemSettings(page);
        await this.setInstanceStatus(page, context.originalStatus);
        context.currentStatus = context.originalStatus;
      } catch (e: any) {
        console.warn(`Failed to restore original instance status: ${e.message}`);
        throw e;
      }
    }
  }

  static async cleanupTestData(page: Page, context: InstanceOfflineTestContext): Promise<void> {
    // Always attempt to restore original status
    if (context.currentStatus !== context.originalStatus) {
      try {
        await this.restoreInstanceStatus(page, context);
      } catch (e: any) {
        console.warn(`Cleanup warning - failed to restore original status: ${e.message}`);
      }
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: InstanceOfflineTestContext) => Promise<T>,
    emergencyCleanupQueue?: Array<{ page: any; context: InstanceOfflineTestContext }>,
    skipCleanup: boolean = false
  ): Promise<T> {
    const context = await this.setupInstanceOfflineTest();

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

      // Only cleanup if not explicitly skipped (useful for sequential tests)
      if (!skipCleanup) {
        await this.cleanupTestData(page, context);
      }
    }
  }

  static async debugInstanceStatus(page: Page): Promise<void> {
    try {
      const statusSelector = page.getByTestId('system-status-selector');
      const isVisible = await statusSelector.isVisible();
      console.log(`Debug: Status selector visible: ${isVisible}`);

      if (isVisible) {
        const inputElement = statusSelector.locator('input');
        const value = await inputElement.getAttribute('value');
        console.log(`Debug: Current status value: ${value}`);
      }
    } catch (e) {
      console.log(`Debug: Error checking status: ${e}`);
    }
  }
}
