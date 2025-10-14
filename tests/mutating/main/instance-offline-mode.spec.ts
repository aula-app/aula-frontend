import { expect, Page, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as navigation from '../../shared/interactions/navigation';
import * as users from '../../shared/interactions/users';
import { UserData } from '../../fixtures/types';

describeWithSetup('Instance Offline', () => {
  let admin: Page;
  let user: Page;
  let userConfig: UserData;

  let instanceOnline = true;

  test.beforeAll(async () => {
    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser('user');

    const hasConfig = await userData.get('user');
    if (!hasConfig) throw new Error('User config not found');
    userConfig = hasConfig;
  });

  test.afterAll(async () => {
    if (!instanceOnline) await changeInstanceStatus(true);
    await admin.close();
    await user.close();
  });

  const changeInstanceStatus = async (online: boolean) => {
    await navigation.goToSettings(admin);
    await navigation.openAccordion(admin, 'config-accordion-system');

    await formInteractions.selectOptionByValue(admin, 'select-field-status', online ? '1' : '0');
    await formInteractions.clickButton(admin, 'system-settings-confirm-button');
    instanceOnline = online;

    await admin.waitForTimeout(500);
    const isExpanded = await admin.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    await expect(isExpanded).toBe('false');

    await navigation.openAccordion(admin, 'config-accordion-system');
    const selectedStatus = await admin.getByTestId('select-field-status-input').inputValue();
    await expect(selectedStatus).toBe(`${Number(online)}`);
  };

  test('Admin can turn instance offline', async () => {
    await changeInstanceStatus(false);
  });

  test('User cannot login with Offline instance', async () => {
    await navigation.goToHome(user);
    await users.loginAttempt(user, userConfig);
    await user.waitForLoadState('networkidle');

    const offlineDiv = user.getByTestId('school-offline-view');
    await expect(offlineDiv).toBeVisible({ timeout: 5000 });
  });

  test('Admin can turn instance back online', async () => {
    await changeInstanceStatus(true);
  });

  test('User can login with Online instance', async () => {
    await navigation.goToHome(user);
    await users.login(user, userConfig);
  });
});
