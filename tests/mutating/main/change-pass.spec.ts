import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as navigation from '../../shared/interactions/navigation';

type PasswordChangeContext = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

describeWithSetup('Change pass flow', () => {
  userData.init();
  let alice: any;

  test.beforeAll(async () => {
    alice = await browsers.newPage(browsers.alices_browser);
  });

  test.afterAll(async () => {
    await alice.close();
  });

  const defaultFields = {
    oldPassword: userData.alice.password,
    newPassword: 'newPassword0',
    confirmPassword: 'newPassword0',
  };

  const changePassword = async (passFields: PasswordChangeContext) => {
    await navigation.goToProfile(alice);
    await navigation.openAccordion(alice, 'security-panel-button');

    for (const [form, value] of Object.entries(passFields)) {
      await formInteractions.fillForm(alice, `${form}-input`, value);
    }

    await formInteractions.clickButton(alice, 'submit-new-password');
  };

  const checkSuccessDiv = async () => {
    const successDiv = alice.getByTestId('password-change-success');
    await successDiv.waitFor({ state: 'visible', timeout: 5000 });
    await alice.waitForTimeout(500);

    // Close the success div by clicking a close button or dismissing it
    const closeButton = successDiv.locator('button[aria-label="Close"]');
    await closeButton.click();
    await successDiv.waitFor({ state: 'hidden', timeout: 5000 });
  };

  test('User can successfully change password with valid inputs', async () => {
    await changePassword(defaultFields);
    await checkSuccessDiv();
  });

  test('User cannot change password with incorrect current password', async () => {
    await changePassword(defaultFields);

    const errorDiv = alice.getByTestId('password-change-error');
    await errorDiv.waitFor({ state: 'visible', timeout: 5000 });
    await alice.waitForTimeout(500);
  });

  test('User cannot change password when new password and confirmation do not match', async () => {
    await changePassword({
      oldPassword: 'newPassword0',
      newPassword: 'newPassword1',
      confirmPassword: 'differentPassword',
    });

    const errorLabel = alice.locator('#confirmPassword-error-message');
    await expect(await errorLabel.textContent()).not.toHaveLength(0);
  });

  test('User cannot submit form with empty password fields', async () => {
    await changePassword({
      oldPassword: 'newPassword0',
      newPassword: 'newPassword1',
      confirmPassword: '',
    });

    const errorLabel = alice.locator('#confirmPassword-error-message');
    await expect(await errorLabel.textContent()).not.toHaveLength(0);
  });

  test('User can change password multiple times in sequence', async () => {
    for (let i = 0; i < 6; i++) {
      const fields = {
        oldPassword: `newPassword${i}`,
        newPassword: `newPassword${i + 1}`,
        confirmPassword: `newPassword${i + 1}`,
      };
      await changePassword(fields);
      await checkSuccessDiv();
    }
  });
});
