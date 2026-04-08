import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as users from '../../interactions/users';
import * as shared from '../../support/utils';

/**
 * Instance Offline Mode Tests
 * Tests system-wide offline mode behavior for admins and users
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they modify global instance state:
 * Set offline → Test offline behavior → Set online → Test online behavior
 */
test.describe.serial('Instance Offline', () => {
  let instanceOnline = true;

  test.afterAll(async ({ adminPage }) => {
    if (!instanceOnline) await changeInstanceStatus(adminPage, true);
  });

  const changeInstanceStatus = async (adminPage: Page, online: boolean) => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-system');

    await formInteractions.selectOptionByValue(adminPage, 'select-field-status', online ? '1' : '0');
    await formInteractions.clickButton(adminPage, 'system-settings-confirm-button');

    const accordion = adminPage.getByTestId('config-accordion-system');
    await expect(accordion).toHaveAttribute('aria-expanded', 'false');

    await navigation.openAccordion(adminPage, 'config-accordion-system');
    const selectedStatus = await adminPage.getByTestId('select-field-status-input').inputValue();
    expect(selectedStatus).toBe(`${Number(online)}`);
    instanceOnline = online;
  };

  test('', async ({ adminPage, userPage, userConfig }) => {
    await test.step('Admin: Change instance status to offline', async () => {
      await changeInstanceStatus(adminPage, false);
    });

    await test.step('Verify offline view is displayed on attempt to login', async () => {
      // Clear stored auth so we always start from the unauthenticated login flow.
      // Without this, a fresh valid token bypasses the login page and the offline view
      // is never shown (the app goes to the authenticated offline state instead).
      // Navigate to the host origin first so localStorage.clear() targets the right domain.
      await userPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
      await userPage.evaluate(() => localStorage.clear());
      try {
        await users.loginAttempt(userPage, userConfig);
      } catch (e) { }
      const offlineDiv = userPage.getByTestId('school-offline-view');
      await expect(offlineDiv).toBeVisible({ timeout: 20000 });
    });

    await test.step('Admin: Change instance status to online', async () => {
      await changeInstanceStatus(adminPage, true);
    });

    await test.step('User: Login successfully with online instance', async () => {
      await users.login(userPage, userConfig);
    });
  });
});
