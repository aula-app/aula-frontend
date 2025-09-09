import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { ChangePasswordTestHelpers, ChangePasswordTestContext } from '../../shared/helpers/change-password';

describeWithSetup('Change pass flow', () => {
  // Track cleanup contexts for emergency cleanup
  const cleanupQueue: Array<{ page: any; context: ChangePasswordTestContext }> = [];

  test.afterEach(async () => {
    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await ChangePasswordTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test('Alice can change her password', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;

          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          await ChangePasswordTestHelpers.changePassword(alice, context.currentPassword, temporaryPassword);
          
          // Update context to reflect password change
          context.currentPassword = temporaryPassword;
        },
        'alice',
        cleanupQueue
      );
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('Alice can change her password back', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;

          // First change to temporary password
          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          await ChangePasswordTestHelpers.changePassword(alice, context.currentPassword, temporaryPassword);
          
          // Update context
          context.currentPassword = temporaryPassword;

          // Then change back to original password
          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          await ChangePasswordTestHelpers.changePassword(alice, temporaryPassword, context.originalPassword);
          
          // Update context
          context.currentPassword = context.originalPassword;
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "Alice can change her password back" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('User cannot change password with invalid current password', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;

          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          
          // Try to change password with wrong current password
          await alice.fill('input[name="oldPassword"]', 'WRONGPASSWORD');
          await alice.fill('input[name="newPassword"]', temporaryPassword);
          await alice.fill('input[name="confirmPassword"]', temporaryPassword);

          const submitButton = alice.getByTestId('submit-new-password');
          await submitButton.click();

          // Should see an error message instead of success
          const errorDiv = alice.getByTestId('error-message')
            .or(alice.locator('[data-testid*="error"]'))
            .or(alice.locator('.MuiAlert-root').filter({ hasText: /fehler|error|ungültig|invalid/i }))
            .or(alice.locator('[class*="error"]'))
            .first();
          
          await expect(errorDiv).toBeVisible();
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "User cannot change password with invalid current password" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });
});
