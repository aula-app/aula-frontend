import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
const fs = require('fs');
const path = require('path');

import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

test.describe('Upload user csv, delete that user', () => {
  let data: { [k: string]: any } = {};

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
    const sym = shared.gensym();
    data.jannikaData = {
      username: 'jannika' + sym,
      realName: 'jannika' + sym,
      displayName: 'jannika' + sym,
      role: 20,
      password: 'aula',
      about: 'jannika',
    };
    //
    const csv_str = `realname;displayname;username;email;about_me
${data.jannikaData.realName};${data.jannikaData.displayName};${data.jannikaData.username};;generated_testing`;

    data.room = {
      name: 'room-' + shared.getRunId() + '-csv' + shared.gensym(),
      description: 'created during automated testing',
      users: [],
    };

    const host = shared.getHost();

    const admin = await browsers.newPage(browsers.admins_browser);

    await admin.goto(host);

    await rooms.create(admin, data.room);

    await users.goToSettings(admin);

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

    await RoomSelector.click({ timeout: 1000 });

    // just select the first room
    await admin.getByRole('option').first().click({ timeout: 1000 });

    const ApproveButton = admin.locator('[data-testing-id="confirm_upload"]');
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click({ timeout: 1000 });

    fs.unlinkSync(filePath);

    await sleep(1);

    await users.exists(admin, data.jannikaData);

    await expect(1).toBeDefined();

    admin.close();
  });

  test('New User can log in using admin temp pass', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);

    const browser = await (await chromium.launch()).newContext();
    const jannika = await browsers.newPage(browser);

    const janikasTempPass = await users.getTemporaryPass(admin, data.jannikaData);

    await users.firstLoginFlow(jannika, data.jannikaData, janikasTempPass);

    await admin.close();
    await jannika.close();
  });

  test('New user requests deletion, and admin deletes.', async () => {
    const host = shared.getHost();

    const admin = await browsers.newPage(browsers.admins_browser);

    await admin.goto(host);

    const browser = await (await chromium.launch()).newContext();
    const jannika = await browsers.newPage(browser);

    await users.login(jannika, data.jannikaData);

    await users.goToProfile(jannika);

    // open benutzer accordeon
    const BenutzerAccordeon = jannika.getByRole('button', { name: 'Gefahrenzone' });
    await expect(BenutzerAccordeon).toBeVisible({ timeout: 1000 });
    await BenutzerAccordeon.click({ timeout: 1000 });

    const RequestDeletionButton = jannika.getByRole('button', { name: 'Kontolöschen anfordern' });
    await expect(RequestDeletionButton).toBeVisible({ timeout: 1000 });
    await RequestDeletionButton.click({ timeout: 1000 });

    const ModalDiv = jannika.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible({ timeout: 1000 });

    const SecondApproveButton = ModalDiv.getByRole('button', { name: 'Löschen' }).first();
    await expect(SecondApproveButton).toBeVisible({ timeout: 1000 });
    await SecondApproveButton.click({ timeout: 1000 });

    // admin actions

    await users.goToRequests(admin);

    const AnfrageDiv = admin
      .locator('div')
      .filter({ hasText: `Kontolöschungsanfrage für ${data.jannikaData.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible({ timeout: 1000 });

    const ApproveButton = AnfrageDiv.getByRole('button', { name: 'Bestätigen' }).first();
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click({ timeout: 1000 });

    const ModalDiv2 = admin.locator('div[role="dialog"]');
    await expect(ModalDiv2).toBeVisible({ timeout: 1000 });

    const SecondApproveButton2 = ModalDiv2.getByRole('button', { name: 'Bestätigen' }).first();
    await expect(SecondApproveButton2).toBeVisible({ timeout: 1000 });
    await SecondApproveButton2.click({ timeout: 1000 });

    // expect the user to not exist any more
    await expect(async () => {
      await users.exists(admin, data.jannikaData);
    }).rejects.toThrow();

    await rooms.remove(admin, data.room);

    admin.close();
    jannika.close();
  });
});
