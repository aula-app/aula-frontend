import { chromium, expect, test } from '@playwright/test';
import * as fixtures from '../../fixtures/users';
import * as browsers from '../../shared/page_interactions/browsers';
import * as users from '../../shared/page_interactions/users';
import * as shared from '../../shared/shared';

test.describe.configure({ mode: 'serial' });

test.describe('Instance Offline Mode', () => {
  test.beforeAll(async () => {
    fixtures.init();
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  test('Admin can set instance offline', async () => {
    // Admin logs in and sets instance offline
    const admin = await browsers.newPage(browsers.admins_browser);
    await users.goToSystemConfig(admin);
    await expect(admin.getByLabel('Konfigurationen')).toBeVisible();
    await admin.getByTestId('config-accordion-system').click();
    await admin.getByRole('combobox', { name: 'Status Aktiv' }).click();
    await admin.getByRole('option', { name: 'Inaktiv' }).click();

    // Admin logs out by clearing context and creating new browser
    await admin.close();
  });

  test("User can't login and receives instance offline message", async () => {
    const host = shared.getHost();
    const userBrowser = await chromium.launch();
    const userContext = await userBrowser.newContext();
    const user = await userContext.newPage();

    // User tries to login and should be redirected to error page
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
    const admin = await browsers.newPage(browsers.admins_browser);
    await users.goToSystemConfig(admin);
    await expect(admin.getByLabel('Konfigurationen')).toBeVisible();
    await admin.getByTestId('config-accordion-system').click();
    await expect(admin.getByRole('combobox', { name: 'Status Aktiv' })).toBeVisible();

    // Admin logs out by clearing context and creating new browser
    await admin.close();
  });
});
