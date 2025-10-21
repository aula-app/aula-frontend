import { expect, Page, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { RoomData, UserData } from '../../fixtures/types';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import { createTestApiClient } from '../../shared/helpers/api-calls';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as navigation from '../../shared/interactions/navigation';
import * as settingsInteractions from '../../shared/interactions/settings';
import * as users from '../../shared/interactions/users';

describeWithSetup('CSV Import', () => {
  let adminPage: Page;
  let room: RoomData;
  let roomResponse: { insert_id: number; hash_id: string };
  let csvUsers: Array<UserData>;
  let csvFilePath: string;

  test.beforeAll(async () => {
    // prepare data locally
    room = entities.createRoom('csv-import-destination-aka-the-cube');
    csvUsers = Array.from({ length: 10 }, (_, i) => entities.createUserData(`csv-import-${i}`));
    const csvUsersFormatted = csvUsers.map((u) => `${u.realName};${u.displayName};${u.username};${u.email};${u.about}`);
    csvFilePath = createTempCsvFile(`realname;displayname;username;email;about_me\n` + csvUsersFormatted.join('\n'));

    // issue API requests to setup environment
    const apiClient = createTestApiClient();
    await apiClient.login(userData.admin.username, userData.admin.password);
    roomResponse = await apiClient.addRoom({
      room_name: room.name,
      description_public: room.description,
      description_internal: room.description,
    });

    // set-up browsers
    adminPage = await browsers.getUserBrowser('admin');
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  test.afterAll(async () => {
    // const apiClient = createTestApiClient();
    csvUsers
      // .filter(u => !!u.hashId)
      .forEach(async (u) => await users.remove(adminPage, u)); // apiClient.deleteUser(u.hashId!!));
    await adminPage.close();
  });

  test('Admins should be able to upload CSV file', async () => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-user');

    await formInteractions.clickButton(adminPage, 'upload-users-csv-button');
    await adminPage.locator('input[type="file"]').setInputFiles(csvFilePath);
    await formInteractions.selectAutocompleteOption(adminPage, 'user-room-autocomplete', room.name);
    await formInteractions.clickButton(adminPage, 'confirm_upload');
  });

  test('imported users should be added to the destination room', async () => {
    await navigation.goToRoomsSettings(adminPage);
    await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'title', value: room.name } });

    const UserSelector = adminPage.getByTestId('users-field');
    await expect(UserSelector).toBeVisible();
    csvUsers.forEach(async (u) => await expect(UserSelector.locator('div div span')).toHaveText(u.displayName));
  });

  const createTempCsvFile = (csvContent: string): string => {
    const filePath = path.join(__dirname, '../../temp', 'csv-import-users.csv');

    // Ensure temp directory exists
    const tempDir = path.dirname(filePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent);
    return filePath;
  };
});
