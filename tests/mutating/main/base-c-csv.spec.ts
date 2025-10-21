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

describeWithSetup('CSV Import', () => {
  let adminPage: Page;
  let room: RoomData;
  let roomResponse: { insert_id: number; hash_id: string };
  let csvUsers: Array<UserData>;
  let csvFilePath: string;

  test.beforeAll(async () => {
    // prepare data locally
    room = entities.createRoom('csv-import-destination');
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

  test.afterAll(async () => {
    // const apiClient = createTestApiClient();
    for (const u of csvUsers) {
      // if (!!u.hashId) {
      // await users.remove(adminPage, u);
      // apiClient.deleteUser(u.hashId!!));
    }
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
    await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'room_name', value: room.name } });

    const UserSelector = adminPage.getByTestId('users-field');
    await expect(UserSelector).toBeVisible();
    const usersNames = await UserSelector.locator('div div span').allTextContents();
    csvUsers.forEach(u => expect(usersNames).toContainEqual(u.realName));
  });

  test('imported users should have no other rooms assigned', async () => {
    for (const u of csvUsers) {
      await navigation.goToUsersSettings(adminPage);

      // Edit this User, open Room Roles Dialog
      await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'username', value: u.username } });
      await formInteractions.clickButton(adminPage, 'room-roles-dialog-open-button');
      const RoomSelector = adminPage.getByTestId('room-roles-dialog');
      await expect(RoomSelector).toBeVisible();

      // Select all rows (all rooms)
      const allRoomsDOMs = await RoomSelector.getByTestId('room-role-list-item').all();

      // Use Promise.all to wait for all filtered input elements
      const usersRoomsDOMs = await Promise.all(allRoomsDOMs.map(async (room) => {
        const input = room.locator('input:not([value="0"])');
        // Wait for the input to be present and return the room if found
        const isVisible = await input.isVisible({ timeout: 1000 });
        return isVisible ? room : null;
      }));

      // Filter out null values
      const filteredUsersRoomsDOMs = usersRoomsDOMs.filter(room => room !== null);

      // Extract names and roles and store in usersRooms array
      const usersRooms = await Promise.all(
        filteredUsersRoomsDOMs.map(async (usersRoomDOM) => {
          const name = await usersRoomDOM.locator('div span[id]').innerText();
          const role = Number(await usersRoomDOM.locator('input:not([value="0"])').getAttribute('value'));
          return { name, role };
        })
      );

      expect(usersRooms).toContainEqual({ name: room.name, role: 20 });
      expect(usersRooms).toHaveLength(2); // (1) Standard Room and (2) CSV import destination Room

      await RoomSelector.getByTestId('room-roles-dialog-cancel-button').click();
      await adminPage.getByTestId('cancel-user-form').click();
    };

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
