import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/aula-tests-fixture';
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
 */
test.describe('Change pass flow', () => {
  const newPassword = 'newPass#veryLongIndeed, one must login with 60 char long pass';

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

  test('User can successfully change password with valid inputs', async ({ newPageFor }) => {
    const userPage = await newPageFor('user');
    const studentPage = await newPageFor('student');

    await test.step('Change password with valid inputs', async () => {
      await changePassword(userPage, {
        oldPassword: TestConstants.DEFAULT_PASSWORD,
        newPassword: newPassword,
        confirmPassword: newPassword,
      });
      await checkSuccessDiv(userPage);
    });

    await test.step('Verify user can login with new password', async () => {
      await logout(userPage);
      await login(userPage, { username: 'user', password: newPassword });
    });

    await test.step('Verify error on password change with old password', async () => {
      await changePassword(userPage, {
        oldPassword: TestConstants.DEFAULT_PASSWORD, // intentionally wrong — password was already changed
        newPassword: 'newPass123456',
        confirmPassword: 'newPass123456',
      });

      const errorDiv = userPage.getByTestId('password-change-error');
      await errorDiv.waitFor({ state: 'visible' });
      await expect(errorDiv).toBeVisible();
    });

    await test.step('Verify user cannot login with old password', async () => {
      await logout(userPage);
      await expect(login(userPage, { username: 'user', password: TestConstants.DEFAULT_PASSWORD })).rejects.toThrow();
    });

    await test.step('Verify some other user still has unchanged password', async () => {
      await logout(studentPage);
      await login(studentPage, { username: 'student', password: TestConstants.DEFAULT_PASSWORD });
    });
  });

  test('User cannot change password when new password and confirmation do not match', async ({ newPageFor }) => {
    const user = await newPageFor('user');

    await test.step('Verify validation error when use unmatched confirmation password', async () => {
      await changePassword(user, {
        oldPassword: TestConstants.DEFAULT_PASSWORD,
        newPassword: 'newPassword1',
        confirmPassword: 'differentPassword',
      });

      const errorLabel = user.locator('#confirmPassword-error-message');
      expect(await errorLabel.textContent()).not.toHaveLength(0);
    });
  });

  test('User cannot submit form with empty password fields', async ({ newPageFor }) => {
    const user = await newPageFor('user');

    await test.step('Verify validation error when empty confirmation of password', async () => {
      await changePassword(user, {
        oldPassword: 'newPassword0',
        newPassword: 'newPassword1',
        confirmPassword: '',
      });

      const errorLabel = user.locator('#confirmPassword-error-message');
      expect(await errorLabel.textContent()).not.toHaveLength(0);
    });
  });

  test('User can change password multiple times in sequence', async ({ newPageFor }) => {
    const userPage = await newPageFor('user');
    let currentPassword = TestConstants.DEFAULT_PASSWORD;

    await test.step('Change password multiple times', async () => {
      const sequence = [
        { newPassword: TestConstants.DEFAULT_PASSWORD },
        { newPassword: 'newPassword1' },
        { newPassword: 'newPassword2' },
      ];

      for (const { newPassword } of sequence) {
        await changePassword(userPage, {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword: newPassword,
        });
        await checkSuccessDiv(userPage);
        currentPassword = newPassword;
      }
    });

    await test.step('Verify user can login with new password', async () => {
      await logout(userPage);
      await login(userPage, { username: 'user', password: currentPassword });
    });
  });
});
