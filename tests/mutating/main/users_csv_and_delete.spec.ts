import { test, expect, chromium } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { sleep } from '../../shared/utils';
import * as shared from '../../shared/shared';
import fs from 'fs';
import path from 'path';
import * as users from '../../shared/page_interactions/users';
import * as rooms from '../../shared/page_interactions/rooms';
import * as browsers from '../../shared/page_interactions/browsers';

describeWithSetup('Upload user csv, delete that user', () => {
  let data: { [k: string]: any } = {};

  test('Admin can upload a user csv', async () => {
    data.jannikaData = TestDataBuilder.createUserData('jannika');

    const csv_str = `realname;displayname;username;email;about_me
${data.jannikaData.realName};${data.jannikaData.displayName};${data.jannikaData.username};;${data.jannikaData.about}`;

    data.room = TestDataBuilder.createRoom('csv', []);

    const host = shared.getHost();
    const admin = await BrowserHelpers.openPageForUser('admin');
    await admin.goto(host);

    // create a room for CSV import placement
    await rooms.create(admin, data.room);

    // navigate to settings
    await users.goToSettings(admin);

    // open benutzer accordeon
    const BenutzerAccordeon = admin.getByTestId('config-accordion-user');
    await expect(BenutzerAccordeon).toBeVisible();
    await BenutzerAccordeon.click({ timeout: 1000 });

    // upload users click
    const UploadButton = admin.getByTestId('upload-users-csv-button');
    await expect(UploadButton).toBeVisible();
    await UploadButton.click({ timeout: 1000 });

    // create and choose the file
    const filePath = path.join(__dirname, '../../temp/temp-upload.txt');
    fs.writeFileSync(filePath, csv_str);
    await admin.setInputFiles('input[type="file"]', filePath);

    // focus room selector
    const RoomSelector = admin.locator('[data-testid="user-room-select"] input');
    await expect(RoomSelector).toBeVisible({ timeout: 500 });
    await RoomSelector.click({ timeout: 1000 });

    // just select the first room
    await admin.getByRole('option').first().click({ timeout: 1000 });

    // confirm csv upload
    const ApproveButton = admin.locator('[data-testid="confirm_upload"]');
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click({ timeout: 1000 });

    // @TODO: nikola - capture HTTP traffic and assert Response is 200 OK, not 409

    fs.unlinkSync(filePath);

    // verify user is added
    await sleep(1);
    await users.exists(admin, data.jannikaData);

    BrowserHelpers.closePage(admin);
  });

  test('New User can log in using admin temp pass', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    const browser = await (await chromium.launch()).newContext();
    const jannika = await browsers.newPage(browser);

    const janikasTempPass = await users.getTemporaryPass(admin, data.jannikaData);

    await users.firstLoginFlow(jannika, data.jannikaData, janikasTempPass);

    await BrowserHelpers.closePage(admin);
    await jannika.close();
  });

  test('New user requests deletion, and admin deletes.', async () => {
    const host = shared.getHost();

    const admin = await BrowserHelpers.openPageForUser('admin');

    await admin.goto(host);

    const browser = await (await chromium.launch()).newContext();
    const jannika = await browsers.newPage(browser);

    await users.login(jannika, data.jannikaData);

    await users.goToProfile(jannika);

    // open benutzer accordeon
    const BenutzerAccordeon = jannika.getByTestId('danger-panel-button');
    await expect(BenutzerAccordeon).toBeVisible();
    await BenutzerAccordeon.click({ timeout: 1000 });

    // click request deletion
    const RequestDeletionButton = jannika.getByTestId('delete-account-button');
    await expect(RequestDeletionButton).toBeVisible();
    await RequestDeletionButton.click({ timeout: 1000 });

    const ModalDiv = jannika.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible();

    // confirm deletion request
    const SecondApproveButton = ModalDiv.getByTestId('delete-button').first();
    await expect(SecondApproveButton).toBeVisible();
    await SecondApproveButton.click({ timeout: 1000 });

    // admin actions
    await users.goToRequests(admin);
    await sleep(1);

    // find deletion request
    const AnfrageDiv = admin
      .locator('div')
      .filter({ hasText: `Kontolöschungsanfrage für ${data.jannikaData.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible();

    // click approve
    const ApproveButton = AnfrageDiv.getByTestId('confirm-request').first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click({ timeout: 1000 });

    const ModalDiv2 = admin.locator('div[role="dialog"]');
    await expect(ModalDiv2).toBeVisible();

    // confirm approval
    const SecondApproveButton2 = ModalDiv2.getByTestId('confirm-request-action').first();
    await expect(SecondApproveButton2).toBeVisible();
    await SecondApproveButton2.click({ timeout: 1000 });

    // expect the user to not exist any more
    await expect(users.exists(admin, data.jannikaData)).rejects.toThrow();

    await rooms.remove(admin, data.room);

    BrowserHelpers.closePage(admin);
    jannika.close();
  });
});
