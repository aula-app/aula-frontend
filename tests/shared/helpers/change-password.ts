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

    // Open security accordion using data-testid for better reliability
    const securityAccordion = page.getByTestId('security-panel-button');
    await securityAccordion.waitFor({ state: 'visible' });
    await securityAccordion.click();
  }

  static async changePassword(page: Page, oldPassword: string, newPassword: string): Promise<void> {
    // Use more specific selectors based on the component structure
    const oldPasswordField = page.locator('#change-password-oldPassword').or(page.locator('input[name="oldPassword"]'));
    const newPasswordField = page.locator('#change-password-newPassword').or(page.locator('input[name="newPassword"]'));
    const confirmPasswordField = page
      .locator('#change-password-confirmPassword')
      .or(page.locator('input[name="confirmPassword"]'));

    await oldPasswordField.fill(oldPassword);
    await newPasswordField.fill(newPassword);
    await confirmPasswordField.fill(newPassword);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();

    // Wait for success message - look for MUI Alert with success severity or role=alert
    const successDiv = page
      .locator('.MuiAlert-standardSuccess')
      .or(page.locator('.MuiAlert-outlinedSuccess'))
      .or(page.locator('.MuiAlert-filledSuccess'))
      .or(
        page.locator(
          '[role="alert"]:not(.MuiAlert-standardError):not(.MuiAlert-outlinedError):not(.MuiAlert-filledError)'
        )
      )
      .first();

    await successDiv.waitFor({ state: 'visible' });
  }

  static async waitForErrorMessage(page: Page): Promise<void> {
    // Wait for error message - look for MUI Alert with error severity
    const errorDiv = page
      .locator('.MuiAlert-standardError')
      .or(page.locator('.MuiAlert-outlinedError'))
      .or(page.locator('.MuiAlert-filledError'))
      .or(page.locator('[role="alert"][class*="error" i]'))
      .first();

    await errorDiv.waitFor({ state: 'visible' });
  }

  static async attemptPasswordChangeWithWrongCurrent(page: Page, wrongPassword: string, newPassword: string): Promise<void> {
    const oldPasswordField = page.locator('#change-password-oldPassword')
      .or(page.locator('input[name="oldPassword"]'));
    const newPasswordField = page.locator('#change-password-newPassword')
      .or(page.locator('input[name="newPassword"]'));
    const confirmPasswordField = page.locator('#change-password-confirmPassword')
      .or(page.locator('input[name="confirmPassword"]'));

    await oldPasswordField.fill(wrongPassword);
    await newPasswordField.fill(newPassword);
    await confirmPasswordField.fill(newPassword);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();
  }

  static async attemptPasswordChangeWithMismatchedConfirmation(
    page: Page, 
    currentPassword: string, 
    newPassword: string, 
    wrongConfirmation: string
  ): Promise<void> {
    const oldPasswordField = page.locator('#change-password-oldPassword')
      .or(page.locator('input[name="oldPassword"]'));
    const newPasswordField = page.locator('#change-password-newPassword')
      .or(page.locator('input[name="newPassword"]'));
    const confirmPasswordField = page.locator('#change-password-confirmPassword')
      .or(page.locator('input[name="confirmPassword"]'));

    await oldPasswordField.fill(currentPassword);
    await newPasswordField.fill(newPassword);
    await confirmPasswordField.fill(wrongConfirmation);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();
  }

  static async waitForFieldValidationError(page: Page, fieldName: 'oldPassword' | 'newPassword' | 'confirmPassword'): Promise<void> {
    const fieldError = page.locator(`#${fieldName}-error-message`)
      .or(page.locator(`[id*="${fieldName}"][id*="error"]`))
      .or(page.locator(`input[name="${fieldName}"] + * [role="alert"], input[name="${fieldName}"] ~ * [role="alert"]`));
    
    await fieldError.waitFor({ state: 'visible' });
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
