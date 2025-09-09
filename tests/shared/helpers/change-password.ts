import { Page } from '@playwright/test';
import * as shared from '../shared';
import * as users from '../page_interactions/users';
import * as fixtures from '../../fixtures/users';

export interface ChangePasswordTestContext {
  currentPassword: string;
  temporaryPassword: string;
  originalPassword: string;
}

export class ChangePasswordTestHelpers {
  static generateTemporaryPassword(): string {
    return 'TEMPPASS' + shared.gensym() + '!!!';
  }

  static async setupChangePasswordTest(userType: 'alice' | 'bob' = 'alice'): Promise<ChangePasswordTestContext> {
    const originalPassword = fixtures[userType].password;
    const temporaryPassword = this.generateTemporaryPassword();

    return {
      currentPassword: originalPassword,
      temporaryPassword,
      originalPassword,
    };
  }

  static async navigateToSecuritySettings(page: Page): Promise<void> {
    const host = shared.getHost();
    await page.goto(host);
    await users.goToProfile(page);

    // Open security accordion
    const securityAccordion = page.getByRole('button', { name: 'Sicherheit' });
    await securityAccordion.waitFor({ state: 'visible' });
    await securityAccordion.click();
  }

  static async changePassword(page: Page, oldPassword: string, newPassword: string): Promise<void> {
    await page.fill('input[name="oldPassword"]', oldPassword);
    await page.fill('input[name="newPassword"]', newPassword);
    await page.fill('input[name="confirmPassword"]', newPassword);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();

    // Wait for success message
    const successDiv = page.getByTestId('success-message')
      .or(page.locator('[data-testid*="success"]'))
      .or(page.locator('.MuiAlert-root').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .or(page.locator('[class*="success"]').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .first();
    
    await successDiv.waitFor({ state: 'visible' });
  }

  static async restorePassword(page: Page, context: ChangePasswordTestContext): Promise<void> {
    try {
      await this.navigateToSecuritySettings(page);
      await this.changePassword(page, context.temporaryPassword, context.originalPassword);
    } catch (e) {
      // If temp password fails, try current password
      try {
        await this.navigateToSecuritySettings(page);
        await this.changePassword(page, context.currentPassword, context.originalPassword);
      } catch (restoreError: any) {
        console.warn(`Failed to restore password: ${restoreError.message}`);
        throw restoreError;
      }
    }
  }

  static async cleanupTestData(page: Page, context: ChangePasswordTestContext): Promise<void> {
    // Always attempt to restore original password
    if (context.currentPassword !== context.originalPassword) {
      try {
        await this.restorePassword(page, context);
      } catch (e: any) {
        console.warn(`Cleanup warning - failed to restore original password: ${e.message}`);
      }
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: ChangePasswordTestContext) => Promise<T>,
    userType: 'alice' | 'bob' = 'alice',
    emergencyCleanupQueue?: Array<{ page: any; context: ChangePasswordTestContext }>
  ): Promise<T> {
    const context = await this.setupChangePasswordTest(userType);

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

  // Additional utility for force cleanup of password state
  static async forceRestorePassword(page: Page, userType: 'alice' | 'bob' = 'alice'): Promise<void> {
    try {
      const originalPassword = fixtures[userType].password;
      const tempPasswords = ['TEMPPASS!!!', this.generateTemporaryPassword()];
      
      for (const tempPassword of tempPasswords) {
        try {
          await this.navigateToSecuritySettings(page);
          await this.changePassword(page, tempPassword, originalPassword);
          return; // Success
        } catch (e) {
          continue; // Try next password
        }
      }
    } catch (e) {
      console.warn(`Failed to force restore password for ${userType}:`, e);
    }
  }
}