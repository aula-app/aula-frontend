import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';

type PasswordChangeContext = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Password Change Tests
 * Tests password change functionality including validation and error handling
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they sequentially change the same user's password:
 * Change password → Test with wrong password → Test validation → Change 6 times
 */
test.describe.serial('Change pass flow', () => {
  const defaultFields = {
    oldPassword: 'aula',
    newPassword: 'newPassword0',
    confirmPassword: 'newPassword0',
  };

  const changePassword = async (user: Page, passFields: PasswordChangeContext) => {
    await navigation.goToProfile(user);
    await navigation.openAccordion(user, 'security-panel-button');

    for (const [form, value] of Object.entries(passFields)) {
      await formInteractions.fillForm(user, form, value);
    }

    await formInteractions.clickButton(user, 'submit-new-password');
  };

  const checkSuccessDiv = async (user: Page) => {
    const successDiv = user.getByTestId('password-change-success');
    await successDiv.waitFor({ state: 'visible', timeout: 5000 });
    await user.waitForTimeout(500);

    // Close the success div by clicking a close button or dismissing it
    const closeButton = successDiv.locator('button[aria-label="Close"]');
    await closeButton.click();
    await successDiv.waitFor({ state: 'hidden', timeout: 5000 });
  };

  test('User can successfully change password with valid inputs', async ({ ensureUser, createUserPage }) => {
    await test.step('Create password test user', async () => {
      await ensureUser('password', 20);
    });

    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Change password with valid inputs', async () => {
      await changePassword(user, defaultFields);
      await checkSuccessDiv(user);
    });
  });

  test('User cannot change password with incorrect current password', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Attempt password change with incorrect current password', async () => {
      await changePassword(user, defaultFields);
    });

    await test.step('Verify error is displayed', async () => {
      const errorDiv = user.getByTestId('password-change-error');
      await errorDiv.waitFor({ state: 'visible', timeout: 5000 });
      await user.waitForTimeout(500);
    });
  });

  test('User cannot change password when new password and confirmation do not match', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Attempt password change with mismatched confirmation', async () => {
      await changePassword(user, {
        oldPassword: 'newPassword0',
        newPassword: 'newPassword1',
        confirmPassword: 'differentPassword',
      });
    });

    await test.step('Verify validation error', async () => {
      const errorLabel = user.locator('#confirmPassword-error-message');
      await expect(await errorLabel.textContent()).not.toHaveLength(0);
    });
  });

  test('User cannot submit form with empty password fields', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Attempt password change with empty confirmation', async () => {
      await changePassword(user, {
        oldPassword: 'newPassword0',
        newPassword: 'newPassword1',
        confirmPassword: '',
      });
    });

    await test.step('Verify validation error', async () => {
      const errorLabel = user.locator('#confirmPassword-error-message');
      await expect(await errorLabel.textContent()).not.toHaveLength(0);
    });
  });

  test('User can change password multiple times in sequence', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Change password 6 times in sequence', async () => {
      for (let i = 0; i < 6; i++) {
        const fields = {
          oldPassword: `newPassword${i}`,
          newPassword: `newPassword${i + 1}`,
          confirmPassword: `newPassword${i + 1}`,
        };
        await changePassword(user, fields);
        await checkSuccessDiv(user);
      }
    });
  });
});
