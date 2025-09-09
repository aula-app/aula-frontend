import { chromium, expect, test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as users from '../../shared/page_interactions/users';
import * as shared from '../../shared/shared';
import * as fixtures from '../../fixtures/users';

describeWithSetup('Instance Offline Mode', () => {

  test('Admin can set instance offline', async () => {
    // Admin logs in and sets instance offline
    const admin = await BrowserHelpers.openPageForUser('admin');
    await users.goToSystemConfig(admin);
    await expect(admin.getByLabel('Konfigurationen')).toBeVisible();
    await admin.getByTestId('config-accordion-system').click();

    // Verify current status is inactive before changing it
    const statusCombobox = admin.getByRole('combobox', { name: 'Status' });
    await expect(statusCombobox).toHaveText(/Aktiv|Active/);

    await statusCombobox.click();
    await admin.getByTestId('status-option-status.inactive').click();
    await admin.getByTestId('system-settings-confirm-button').click();

    // Admin logs out by clearing context and creating new browser
    await BrowserHelpers.closePage(admin);
  });

  test("User can't login and receives instance offline message", async () => {
    const host = shared.getHost();
    const userBrowser = await chromium.launch();
    const userContext = await userBrowser.newContext();
    const user = await userContext.newPage();

    // User tries to login
    await user.goto(host);
    await user.fill('input[name="username"]', fixtures.alice.username);
    await user.fill('input[name="password"]', fixtures.alice.password);
    await user.getByRole('button', { name: 'Login' }).click({ timeout: 1000 });

    // Verify user cannot access overview page
    await expect(user.getByRole('img', { name: 'Schlafende' })).toBeVisible();
    await expect(user.getByText('Die Schule ist derzeit')).toBeVisible();

    // User logs out by clearing context and creating new browser
    await user.close();
  });

  test('Admin can set instance online again', async () => {
    // Admin logs in and sets instance online again
    const admin = await BrowserHelpers.openPageForUser('admin');
    await users.goToSystemConfig(admin);
    await expect(admin.getByLabel('Konfigurationen')).toBeVisible();
    await admin.getByTestId('config-accordion-system').click();
    await expect(admin.getByRole('combobox', { name: 'Status' })).toBeVisible();

    // Verify current status is inactive before changing it
    const statusCombobox = admin.getByRole('combobox', { name: 'Status' });
    await expect(statusCombobox).toHaveText(/Inaktiv|Inactive/);

    await statusCombobox.click();
    await admin.getByTestId('status-option-status.active').click();
    await admin.getByTestId('system-settings-confirm-button').click();

    // Admin logs out by clearing context and creating new browser
    await BrowserHelpers.closePage(admin);
  });
});
