import { test } from '@playwright/test';
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

  test('User can successfully change password with valid inputs', async () => {
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

  test('User can change password multiple times in sequence', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;
          const secondPassword = ChangePasswordTestHelpers.generateTemporaryPassword();

          // First password change
          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          await ChangePasswordTestHelpers.changePassword(alice, context.currentPassword, temporaryPassword);
          context.currentPassword = temporaryPassword;

          // Manually dismiss the success message before proceeding with the second password change
          const successDiv = alice.getByTestId('password-change-success');
          await successDiv.waitFor({ state: 'visible' });

          const closeButton = successDiv.locator('button[aria-label*="Close"], button[title*="close"]').first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
            await successDiv.waitFor({ state: 'hidden' });
          }

          // Wait a bit more to ensure form state is properly reset
          await alice.waitForTimeout(1000);

          // Second password change
          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);
          await ChangePasswordTestHelpers.changePassword(alice, temporaryPassword, secondPassword);
          context.currentPassword = secondPassword;
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "User can change password multiple times in sequence" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('User cannot change password with incorrect current password', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;

          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);

          await ChangePasswordTestHelpers.attemptPasswordChangeWithWrongCurrent(
            alice,
            'WRONGPASSWORD',
            temporaryPassword
          );
          await ChangePasswordTestHelpers.waitForErrorMessage(alice);
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "User cannot change password with incorrect current password" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('User cannot change password when new password and confirmation do not match', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async (context) => {
          const { temporaryPassword } = context;

          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);

          await ChangePasswordTestHelpers.attemptPasswordChangeWithMismatchedConfirmation(
            alice,
            context.currentPassword,
            temporaryPassword,
            temporaryPassword + 'DIFFERENT'
          );

          await ChangePasswordTestHelpers.waitForFieldValidationError(alice, 'confirmPassword');
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "User cannot change password when passwords do not match" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('User cannot submit form with empty password fields', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      await ChangePasswordTestHelpers.executeWithCleanup(
        alice,
        async () => {
          await ChangePasswordTestHelpers.navigateToSecuritySettings(alice);

          const submitButton = alice.getByTestId('submit-new-password');
          await submitButton.click();

          await ChangePasswordTestHelpers.waitForFieldValidationError(alice, 'oldPassword');
        },
        'alice',
        cleanupQueue
      );
    } catch (error) {
      console.error('Test "User cannot submit form with empty fields" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });
});
