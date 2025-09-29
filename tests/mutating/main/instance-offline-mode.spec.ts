import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as navigation from '../../shared/interactions/navigation';
import * as users from '../../shared/interactions/users';

describeWithSetup('Instance Offline', () => {
  let admin: any;
  let alice: any;

  let instanceOnline = true;

  test.beforeAll(async () => {
    admin = await browsers.newPage(browsers.admins_browser);
    alice = await browsers.newPage(browsers.alices_browser);
  });

  test.afterAll(async () => {
    if (!instanceOnline) await changeInstanceStatus(true);
    await admin.close();
    await alice.close();
  });

  const changeInstanceStatus = async (online: boolean) => {
    await navigation.goToSettings(admin);
    await navigation.openAccordion(admin, 'config-accordion-system');

    await formInteractions.selectOption(
      admin,
      'system-status-selector',
      online ? 'status-option-status.active' : 'status-option-status.inactive'
    );
    await formInteractions.clickButton(admin, 'system-settings-confirm-button');
    await admin.waitForTimeout(500);
    instanceOnline = online;

    const isExpanded = await admin.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    await expect(isExpanded).toBe('false');

    await navigation.openAccordion(admin, 'config-accordion-system');
    const selectedStatus = await admin.getByTestId('system-status-selector-input').inputValue();
    await expect(selectedStatus).toBe(`${Number(online)}`);
  };

  test('Admin can turn instance offline', async () => {
    await changeInstanceStatus(false);
  });

  test('User cannot login with Offline instance', async () => {
    await navigation.goToHome(alice);
    await users.loginAttempt(alice, userData.testUsers.alice());
    await alice.waitForLoadState('networkidle');

    const offlineDiv = alice.getByTestId('school-offline-view');
    await expect(offlineDiv).toBeVisible({ timeout: 5000 });
  });

  test('Admin can turn instance back online', async () => {
    await changeInstanceStatus(true);
  });

  test('User can login with Online instance', async () => {
    await navigation.goToHome(alice);
    await users.login(alice, userData.alice);
  });
});
