import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
const fs = require('fs');
const path = require('path');

import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';
import * as users from './page_interactions/users';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

const jannikaData: fixtures.UserData = {
  username: 'jannika',
  realName: 'jannika',
  displayName: 'jannika',
  role: 20,
  password: 'aula',
  about: 'jannika',
};

test.describe('Upload user csv', () => {
  test.beforeAll(async () => {
    fixtures.init();
  });
  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  //
  test('Admin can upload a user csv', async () => {
    //
    const csv_str = `realname;displayname;username;email;about_me
jannika;jannika;jannika;;generated_testing`;

    const host = shared.getHost();

    const admin = await browsers.newPage(browsers.admins_browser);

    await admin.goto(host);

    // navigate to the setting page:
    const SettingsButton = admin.locator('a[href="/settings/configuration"]');
    await expect(SettingsButton).toBeVisible({ timeout: 1000 });
    await SettingsButton.click({ timeout: 1000 });

    // open benutzer accordeon
    const BenutzerAccordeon = admin.getByRole('button', { name: 'Benutzer' });
    await expect(BenutzerAccordeon).toBeVisible({ timeout: 1000 });
    await BenutzerAccordeon.click({ timeout: 1000 });

    const UploadButton = admin.getByRole('button', { name: 'Datei Hochladen' });
    await expect(UploadButton).toBeVisible({ timeout: 1000 });
    await UploadButton.click({ timeout: 1000 });

    const filePath = path.join(__dirname, 'temp-upload.txt');
    fs.writeFileSync(filePath, csv_str);

    await admin.setInputFiles('input[type="file"]', filePath);

    //
    const RoomSelector = admin.locator('[data-testing-id="user-room-select"] input');
    await expect(RoomSelector).toBeVisible({ timeout: 500 });

    await RoomSelector.click();

    // just select the first room
    await admin.getByRole('option').first().click();

    const ApproveButton = admin.locator('[data-testing-id="confirm_upload"]');
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click({ timeout: 1000 });

    fs.unlinkSync(filePath);

    await sleep(1);

    await expect(1).toBeDefined();
  });

  test('New User can log in using admin temp pass', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);

    const browser = await (await chromium.launch()).newContext();
    const jannika = await browsers.newPage(browser);

    const janikasTempPass = await users.getTemporaryPass(admin, jannikaData);

    await users.firstLoginFlow(jannika, jannikaData, janikasTempPass);

    await admin.close();
    await jannika.close();
  });

  test('Admin deletes new user', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);

    await users.remove(admin, jannikaData);

    await admin.close();
  });
});
