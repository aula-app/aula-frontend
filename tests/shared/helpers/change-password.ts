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

  static async debugPasswordState(page: Page, userType: 'alice' | 'bob' = 'alice'): Promise<void> {
    console.log(`Debug: Expected password for ${userType}: ${fixtures[userType].password}`);

    // Try to see what's in the form fields
    const oldPasswordField = page.locator('#change-password-oldPassword').or(page.locator('input[name="oldPassword"]'));
    const fieldVisible = await oldPasswordField.isVisible();
    console.log(`Debug: Password field visible: ${fieldVisible}`);

    if (fieldVisible) {
      const fieldValue = await oldPasswordField.inputValue();
      console.log(`Debug: Current old password field value: ${fieldValue.substring(0, 3)}***`);
    }
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

    // Clear fields first to ensure clean state
    await oldPasswordField.clear();
    await newPasswordField.clear();
    await confirmPasswordField.clear();

    await oldPasswordField.fill(oldPassword);
    await newPasswordField.fill(newPassword);
    await confirmPasswordField.fill(newPassword);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();

    // Wait for either success or error message - don't assume success
    const successDiv = page.getByTestId('password-change-success');
    const errorDiv = page.getByTestId('password-change-error');

    try {
      await successDiv.waitFor({ state: 'visible', timeout: 5000 });
      // Wait a brief moment for the success message to be fully displayed
      await page.waitForTimeout(500);
    } catch (e) {
      // If success doesn't appear, check if there's an error
      const errorVisible = await errorDiv.isVisible();
      if (errorVisible) {
        const errorText = await errorDiv.textContent();
        throw new Error(`Password change failed with error: ${errorText}`);
      }
      // Re-throw original timeout if no error message either
      throw new Error(
        `Password change timed out - neither success nor error message appeared. Old password: ${oldPassword.substring(0, 3)}***`
      );
    }
  }

  static async tryChangePasswordWithFallback(
    page: Page,
    possibleOldPasswords: string[],
    newPassword: string
  ): Promise<void> {
    let lastError: Error | null = null;

    for (const oldPassword of possibleOldPasswords) {
      try {
        await this.changePassword(page, oldPassword, newPassword);
        return; // Success!
      } catch (error: any) {
        lastError = error;
        console.log(`Failed with password ${oldPassword.substring(0, 3)}***, trying next...`);

        // If there's an error message visible, dismiss it before trying next password
        const errorDiv = page.getByTestId('password-change-error');
        if (await errorDiv.isVisible()) {
          const closeButton = errorDiv
            .locator('button[aria-label*="Close"], button[title*="Close"], .MuiIconButton-root')
            .first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
          }
        }

        // Wait a bit before next attempt
        await page.waitForTimeout(500);
      }
    }

    throw lastError || new Error('All password attempts failed');
  }

  static async waitForErrorMessage(page: Page): Promise<void> {
    // Wait for error message using metadata approach
    const errorDiv = page.getByTestId('password-change-error');
    await errorDiv.waitFor({ state: 'visible' });
  }

  static async attemptPasswordChangeWithWrongCurrent(
    page: Page,
    wrongPassword: string,
    newPassword: string
  ): Promise<void> {
    const oldPasswordField = page.locator('#change-password-oldPassword').or(page.locator('input[name="oldPassword"]'));
    const newPasswordField = page.locator('#change-password-newPassword').or(page.locator('input[name="newPassword"]'));
    const confirmPasswordField = page
      .locator('#change-password-confirmPassword')
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
    const oldPasswordField = page.locator('#change-password-oldPassword').or(page.locator('input[name="oldPassword"]'));
    const newPasswordField = page.locator('#change-password-newPassword').or(page.locator('input[name="newPassword"]'));
    const confirmPasswordField = page
      .locator('#change-password-confirmPassword')
      .or(page.locator('input[name="confirmPassword"]'));

    await oldPasswordField.fill(currentPassword);
    await newPasswordField.fill(newPassword);
    await confirmPasswordField.fill(wrongConfirmation);

    const submitButton = page.getByTestId('submit-new-password');
    await submitButton.click();
  }

  static async waitForFieldValidationError(
    page: Page,
    fieldName: 'oldPassword' | 'newPassword' | 'confirmPassword'
  ): Promise<void> {
    const fieldError = page
      .locator(`#${fieldName}-error-message`)
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
