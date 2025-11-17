import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as users from '../../interactions/users';

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
    instanceOnline = online;

    await adminPage.waitForTimeout(500);
    const isExpanded = await adminPage.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    await expect(isExpanded).toBe('false');

    await navigation.openAccordion(adminPage, 'config-accordion-system');
    const selectedStatus = await adminPage.getByTestId('select-field-status-input').inputValue();
    await expect(selectedStatus).toBe(`${Number(online)}`);
  };

  test('Admin can turn instance offline', async ({ adminPage }) => {
    await test.step('Change instance status to offline', async () => {
      await changeInstanceStatus(adminPage, false);
    });
  });

  test('User cannot login with Offline instance', async ({ userPage, userConfig }) => {
    await test.step('Attempt to login with offline instance', async () => {
      await navigation.goToHome(userPage);
      await users.loginAttempt(userPage, userConfig);
      await userPage.waitForLoadState('networkidle');
    });

    await test.step('Verify offline view is displayed', async () => {
      const offlineDiv = userPage.getByTestId('school-offline-view');
      await expect(offlineDiv).toBeVisible({ timeout: 5000 });
    });
  });

  test('Admin can turn instance back online', async ({ adminPage }) => {
    await test.step('Change instance status to online', async () => {
      await changeInstanceStatus(adminPage, true);
    });
  });

  test('User can login with Online instance', async ({ userPage, userConfig }) => {
    await test.step('Login successfully with online instance', async () => {
      await navigation.goToHome(userPage);
      await users.login(userPage, userConfig);
    });
  });
});
