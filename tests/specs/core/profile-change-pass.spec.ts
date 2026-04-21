import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import { TestConstants } from '../../support/config';
import { login, logout } from '../../interactions/users';

type PasswordChangeContext = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Password Change Tests
 * Tests password change functionality including validation and error handling
 *
 * NOTE: Tests run serially — they share one user whose password is mutated
 * across tests. currentPassword tracks the real backend state so each test
 * uses the correct old password regardless of order or prior failures.
 *
 * Retries are disabled: a retry would send the wrong "old password" since
 * the backend state was already mutated on the first attempt.
 */
test.describe.configure({ retries: 0 });
test.describe.serial('Change pass flow', () => {
  // Tracks the user's actual current password across serial tests.
  let currentPassword = TestConstants.DEFAULT_PASSWORD;

  const changedPassword = 'newPass#veryLongIndeed, one must login with 60 char long pass';

  const changePassword = async (user: Page, passFields: PasswordChangeContext) => {
    await navigation.goToProfile(user);
    await navigation.openAccordion(user, 'security-panel-button');

    for (const [formFieldName, value] of Object.entries(passFields)) {
      await formInteractions.fillForm(user, formFieldName, value);
    }

    await formInteractions.clickButton(user, 'submit-new-password');
  };

  const checkSuccessDiv = async (userPage: Page) => {
    // Wait for either outcome — the same Collapse renders success or error depending on API result.
    const messageDiv = userPage.locator('[data-testid="password-change-success"], [data-testid="password-change-error"]');
    await messageDiv.waitFor({ state: 'visible' });

    // If the error variant appeared, surface the backend message immediately instead of timing out.
    const errorDiv = userPage.getByTestId('password-change-error');
    if (await errorDiv.isVisible()) {
      const errorText = await errorDiv.textContent();
      throw new Error(`Password change failed — backend returned: "${errorText?.trim()}"`);
    }

    const successDiv = userPage.getByTestId('password-change-success');
    const closeButton = successDiv.locator('button[aria-label="Close"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await successDiv.waitFor({ state: 'hidden' });
  };

  test('User can successfully change password with valid inputs', async ({ ensureUser, createUserPage }) => {
    await test.step('Create password test user', async () => {
      await ensureUser('password', 20);
    });

    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Change password with valid inputs', async () => {
      await changePassword(user, {
        oldPassword: currentPassword,
        newPassword: changedPassword,
        confirmPassword: changedPassword,
      });
      await checkSuccessDiv(user);
      currentPassword = changedPassword;
    });

    await test.step('Verify user can login with new password', async () => {
      await logout(user);
      await login(user, { ...passwordUser, password: currentPassword });
    });
  });

  test('User cannot change password with incorrect current password', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Attempt password change with incorrect current password', async () => {
      await changePassword(user, {
        oldPassword: TestConstants.DEFAULT_PASSWORD, // intentionally wrong — password was already changed
        newPassword: changedPassword,
        confirmPassword: changedPassword,
      });
    });

    await test.step('Verify error is displayed', async () => {
      const errorDiv = user.getByTestId('password-change-error');
      await errorDiv.waitFor({ state: 'visible' });
      await expect(errorDiv).toBeVisible();
    });
  });

  test('User cannot change password when new password and confirmation do not match', async ({
    ensureUser,
    createUserPage,
  }) => {
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
      expect(await errorLabel.textContent()).not.toHaveLength(0);
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
      expect(await errorLabel.textContent()).not.toHaveLength(0);
    });
  });

  test('User can change password multiple times in sequence', async ({ ensureUser, createUserPage }) => {
    const passwordUser = await ensureUser('password');
    const user = await createUserPage(passwordUser.username);

    await test.step('Change password multiple times, resetting to original at the end', async () => {
      const sequence = [
        { newPassword: 'newPassword1' },
        { newPassword: 'newPassword2' },
        // Final iteration resets back to DEFAULT_PASSWORD so the user ends in a known state.
        { newPassword: TestConstants.DEFAULT_PASSWORD },
      ];

      for (const { newPassword } of sequence) {
        await changePassword(user, {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword: newPassword,
        });
        await checkSuccessDiv(user);
        currentPassword = newPassword;
      }
    });
  });
});
