import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import * as rooms from '../../shared/interactions/rooms';
import * as settingsInteractions from '../../shared/interactions/settings';
import * as shared from '../../shared/shared';

describeWithSetup('Instance Offline', () => {
  let admin: any;
  let alice: any;

  let instanceOnline = true;

  test.beforeAll(async () => {
    admin = await browsers.newPage(browsers.admins_browser);
    alice = await browsers.newPage(browsers.alices_browser);
  });

  test('Admin can turn instance offline', async () => {
    await navigation.goToSettings(admin);
    await navigation.openAccordion(admin, 'config-accordion-system');

    await formInteractions.selectOption(admin, 'system-status-selector', 'status-option-status.inactive');
    await formInteractions.clickButton(admin, 'system-settings-confirm-button');
    await admin.waitForTimeout(500);
    instanceOnline = false;

    const isExpanded = await admin.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    expect(isExpanded).toBe('false');

    await navigation.openAccordion(admin, 'config-accordion-system');
    const selectedStatus = await admin.getByTestId('system-status-selector-input').inputValue();
    expect(selectedStatus).toBe('0');
  });

  test('Admin can turn instance back online', async () => {
    await navigation.goToSettings(admin);
    await navigation.openAccordion(admin, 'config-accordion-system');

    await formInteractions.selectOption(admin, 'system-status-selector', 'status-option-status.active');
    await formInteractions.clickButton(admin, 'system-settings-confirm-button');
    await admin.waitForTimeout(500);
    instanceOnline = true;

    const isExpanded = await admin.getByTestId('config-accordion-system').getAttribute('aria-expanded');
    expect(isExpanded).toBe('false');

    await navigation.openAccordion(admin, 'config-accordion-system');
    const selectedStatus = await admin.getByTestId('system-status-selector-input').inputValue();
    expect(selectedStatus).toBe('1');
  });
});
