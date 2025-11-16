import { expect, Page, test } from '@playwright/test';
import * as userData from '../../fixtures/data/users';
import { describeWithSetup } from '../../lifecycle/base-test';
import * as browsers from '../../interactions/browsers';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';

type PasswordChangeContext = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

describeWithSetup('Change pass flow', () => {
  let user: Page;
  const defaultFields = {
    oldPassword: 'aula',
    newPassword: 'newPassword0',
    confirmPassword: 'newPassword0',
  };

  const clearQueue = {
    currentPassword: null as string | null,
  };

  test.beforeAll(async () => {
    const passUserData = await userData.use('password');
    user = await browsers.getUserBrowser(passUserData.username);
  });

  test.afterAll(async () => {
    const passUser = userData.get('password');
    if (passUser) {
      await userData.clear(passUser);
    }
  });

  const changePassword = async (passFields: PasswordChangeContext) => {
    await navigation.goToProfile(user);
    await navigation.openAccordion(user, 'security-panel-button');

    for (const [form, value] of Object.entries(passFields)) {
      await formInteractions.fillForm(user, form, value);
    }

    await formInteractions.clickButton(user, 'submit-new-password');
  };

  const checkSuccessDiv = async () => {
    const successDiv = user.getByTestId('password-change-success');
    await successDiv.waitFor({ state: 'visible', timeout: 5000 });
    await user.waitForTimeout(500);

    // Close the success div by clicking a close button or dismissing it
    const closeButton = successDiv.locator('button[aria-label="Close"]');
    await closeButton.click();
    await successDiv.waitFor({ state: 'hidden', timeout: 5000 });
  };

  test('User can successfully change password with valid inputs', async () => {
    await changePassword(defaultFields);
    await checkSuccessDiv();
    clearQueue.currentPassword = defaultFields.newPassword;
  });

  test('User cannot change password with incorrect current password', async () => {
    await changePassword(defaultFields);

    const errorDiv = user.getByTestId('password-change-error');
    await errorDiv.waitFor({ state: 'visible', timeout: 5000 });
    await user.waitForTimeout(500);
  });

  test('User cannot change password when new password and confirmation do not match', async () => {
    await changePassword({
      oldPassword: 'newPassword0',
      newPassword: 'newPassword1',
      confirmPassword: 'differentPassword',
    });

    const errorLabel = user.locator('#confirmPassword-error-message');
    await expect(await errorLabel.textContent()).not.toHaveLength(0);
  });

  test('User cannot submit form with empty password fields', async () => {
    await changePassword({
      oldPassword: 'newPassword0',
      newPassword: 'newPassword1',
      confirmPassword: '',
    });

    const errorLabel = user.locator('#confirmPassword-error-message');
    await expect(await errorLabel.textContent()).not.toHaveLength(0);
  });

  test('User can change password multiple times in sequence', async () => {
    for (let i = 0; i < 6; i++) {
      const fields = {
        oldPassword: `newPassword${i}`,
        newPassword: `newPassword${i + 1}`, // revert to original on last change
        confirmPassword: `newPassword${i + 1}`,
      };
      await changePassword(fields);
      await checkSuccessDiv();
      clearQueue.currentPassword = fields.newPassword;
    }
  });
});
