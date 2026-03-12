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

    await adminPage.waitForTimeout(500);
    const isExpanded = await adminPage.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    expect(isExpanded).toBe('false');

    await navigation.openAccordion(adminPage, 'config-accordion-system');
    const selectedStatus = await adminPage.getByTestId('select-field-status-input').inputValue();
    expect(selectedStatus).toBe(`${Number(online)}`);
    instanceOnline = online;
  };

  test('', async ({ adminPage, userPage, userConfig }) => {
    await test.step('Admin: Change instance status to offline', async () => {
      await changeInstanceStatus(adminPage, false);
    });

    // @FIXME: nikola - this test is often failing because it relies on user being registered as part of
    //   user.fixture.ts base test (using api-users.ts#registerUserViaAPI)
    //   so it only succeeds if the user is already created and in the auth-states (ie. userData) cache
    await test.step('Verify offline view is displayed on attempt to login', async () => {
      try {
        await users.loginAttempt(userPage, userConfig);
      } catch (e) { }
      const offlineDiv = userPage.getByTestId('school-offline-view');
      await expect(offlineDiv).toBeVisible({ timeout: 5000 });
    });

    await test.step('Admin: Change instance status to online', async () => {
      await changeInstanceStatus(adminPage, true);
    });

    await test.step('User: Login successfully with online instance', async () => {
      await users.login(userPage, userConfig);
    });
  });
});
