import fs from 'fs';
import path from 'path';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as formInteractions from '../../interactions/forms';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as roomsSettings from '../../interactions/admin-settings/rooms';
import * as settingsInteractions from '../../interactions/settings';
import * as usersSettings from '../../interactions/admin-settings/users';
import * as users from '../../interactions/users';
import { RoomData, UserData } from '../../support/types';
import * as shared from '../../support/utils';

/**
 * CSV Import Tests
 * Tests CSV user import, duplicate handling, room assignments, and permissions
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Upload CSV → Verify import → Re-import (test duplicates) → Test imported users
 */
test('CSV Import', async ({ dbInstanceCode, ensureStatePathFor, newPageFor }) => {
  test.setTimeout(360_000); // 6 minutes - CSV import and user verification can be time-consuming, especially with multiple users and rooms

  const adminPage = await newPageFor('admin');

  const csvUsers: Array<UserData> = Array.from({ length: 3 }, (_, i) => entities.createUserData(`csv-import-${i}`));
  const room1: RoomData = entities.createRoom('csv-import-destination');
  const room2: RoomData = entities.createRoom('csv-import-destination-2');

  let csvFilePath: string;

  await test.step('Admin imports 1st CSV', async () => {
    await test.step('Prepare CSV file', async () => {
      // prepare data locally (skip emails)
      const csvUsersFormatted = csvUsers.map((u) => `${u.realName};${u.displayName};${u.username};;${u.about}`);
      csvFilePath = createTempCsvFile(`realname;displayname;username;email;about_me\n` + csvUsersFormatted.join('\n'));
    });

    await test.step('Admin - Create room via UI', async () => {
      await roomsSettings.create(adminPage, room1);
    });

    await test.step('Admin should be able to upload CSV file', async () => {
      await navigation.goToSettings(adminPage);
      await navigation.openAccordion(adminPage, 'config-accordion-user');

      await formInteractions.clickButton(adminPage, 'upload-users-csv-button');
      await adminPage.locator('input[type="file"]').setInputFiles(csvFilePath);
      await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room1.name);
      await formInteractions.clickButton(adminPage, 'confirm_upload');
    });

    await test.step('Admin should be able to confirm imported users are added to the destination room', async () => {
      // Open Room edit dialog
      await navigation.goToRoomsSettings(adminPage);
      await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'room_name', value: room1.name } });

      // Capture all users of the Room
      const UserSelector = adminPage.getByTestId('users-field');
      await expect(UserSelector).toBeVisible();
      const usersNames = await UserSelector.locator('div div :not(legend) > span').allTextContents();

      // Verify no users missing or no extra users in the Room compared to CSV users
      const csvRealNames = csvUsers.map((c) => c.realName);
      expect(csvRealNames).toEqual(expect.arrayContaining(usersNames));
      expect(usersNames).toEqual(expect.arrayContaining(csvRealNames));
    });

    await test.step('Admin should capture temp password of the imported users', async () => {
      for (const u of csvUsers) {
        u.tempPass = await usersSettings.getTemporaryPass(adminPage, u);
      }
    });

    await test.step('Admin should be able to confirm that imported users should have no other rooms assigned', async () => {
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
        const usersRoomsDOMs = await Promise.all(
          allRoomsDOMs.map(async (room) => {
            const input = room.locator('input:not([value="0"])');
            // Wait for the input to be present and return the room if found
            const isVisible = await input.isVisible({ timeout: 100 });
            return isVisible ? room : null;
          })
        );

        // Filter out null values
        const filteredUsersRoomsDOMs = usersRoomsDOMs.filter((room) => room !== null);

        // Extract names and roles and store in usersRooms array
        const usersRooms = await Promise.all(
          filteredUsersRoomsDOMs.map(async (usersRoomDOM) => {
            const name = await usersRoomDOM
              .locator('div span[id]:not(span[id="roles-error-message"])')
              .innerText({ timeout: 100 });
            const role = Number(await usersRoomDOM.locator('input:not([value="0"])').getAttribute('value'));
            return { name, role };
          })
        );

        expect(usersRooms).toContainEqual({ name: room1.name, role: 20 });
        expect(usersRooms).toHaveLength(2); // (1) Standard Room and (2) CSV import destination Room

        await RoomSelector.getByTestId('room-roles-dialog-cancel-button').click();
        await adminPage.getByTestId('cancel-user-form').click();
      }
    });
  });

  // Import 2nd CSV - extended (+1 user, diff. dest. room, 1 diff. role)
  await test.step('Admin imports 2nd CSV', async () => {
    await test.step('Admin - Create new room2 via UI', async () => {
      await roomsSettings.create(adminPage, room2);
    });

    await test.step('Admin - prepare new CSV file', async () => {
      csvUsers.push(entities.createUserData('csv-import-NEW-4'));
      const csvUsersFormatted = csvUsers.map((u) => `${u.realName};${u.displayName};${u.username};;${u.about}`);
      csvFilePath = createTempCsvFile(`any;header;name;should;work\n` + csvUsersFormatted.join('\n'));
    });

    await test.step('Admin should be able to upload CSV file (role=moderator)', async () => {
      await navigation.goToSettings(adminPage);
      await navigation.openAccordion(adminPage, 'config-accordion-user');

      // Upload CSV as role=30 and into both room1 and room2
      await formInteractions.clickButton(adminPage, 'upload-users-csv-button');
      await adminPage.locator('input[type="file"]').setInputFiles(csvFilePath);
      await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room1.name);
      await adminPage.getByRole('option', { name: room1.name }).waitFor({ state: 'hidden' });
      await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room2.name);
      await adminPage.getByRole('option', { name: room2.name }).waitFor({ state: 'hidden' });
      await formInteractions.selectOptionByValue(adminPage, 'select-field-role', '30');
      await formInteractions.clickButton(adminPage, 'confirm_upload');
    });

    await test.step('Admin should be able to confirm imported users are added to the destination room2', async () => {
      // Open Room edit dialog
      await navigation.goToRoomsSettings(adminPage);
      await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'room_name', value: room2.name } });

      // Capture all users of the Room
      const UserSelector = adminPage.getByTestId('users-field');
      await expect(UserSelector).toBeVisible();
      const usersNames = await UserSelector.locator('div div :not(legend) > span').allTextContents();

      // Verify no users missing or no extra users in the Room compared to CSV users
      const csvRealNames = csvUsers.map((c) => c.realName);
      expect(csvRealNames).toEqual(expect.arrayContaining(usersNames));
      expect(usersNames).toEqual(expect.arrayContaining(csvRealNames));
    });

    await test.step('Admin should verify users are not duplicated or recreated (their temp password is unchanged)', async () => {
      for (const u of csvUsers) {
        // this will also inherently verify that no duplicate users were created because it checks
        // locator('...').textContent()! which will fail if there's multiple DOMs matched by the locator
        const currentPass = await usersSettings.getTemporaryPass(adminPage, u);

        if (!u.username.startsWith('test-csv-import-NEW-4')) {
          // For existing users, verify password hasn't changed
          expect(u.tempPass).toBeDefined();
          expect(u.tempPass).toEqual(currentPass);
        } else {
          // For new users, capture their temp password
          u.tempPass = currentPass;
        }
      }
    });

    await test.step('Admin should be able to confirm that imported users are assigned to old and new rooms only', async () => {
      for (const u of csvUsers) {
        await navigation.goToUsersSettings(adminPage);

        // Edit this User, open Room Roles Dialog
        await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'username', value: u.username } });

        if (u.role < 30) {
          await formInteractions.clickButton(adminPage, 'room-roles-dialog-open-button');
          const RoomSelector = adminPage.getByTestId('room-roles-dialog');
          await expect(RoomSelector).toBeVisible();

          // Select all rows (all rooms)
          const allRoomsDOMs = await RoomSelector.getByTestId('room-role-list-item').all();

          // Use Promise.all to wait for all filtered input elements
          const usersRoomsDOMs = await Promise.all(
            allRoomsDOMs.map(async (room) => {
              const input = room.locator('input:not([value="0"])');
              // Wait for the input to be present and return the room if found
              const isVisible = await input.isVisible({ timeout: 1000 });
              return isVisible ? room : null;
            })
          );

          // Filter out null values
          const filteredUsersRoomsDOMs = usersRoomsDOMs.filter((room) => room !== null);

          // Extract names and roles and store in usersRooms array
          const usersRooms = await Promise.all(
            filteredUsersRoomsDOMs.map(async (usersRoomDOM) => {
              const name = await usersRoomDOM
                .locator('div span[id]:not(span[id="roles-error-message"])')
                .innerText({ timeout: 100 });
              const role = Number(await usersRoomDOM.locator('input:not([value="0"])').getAttribute('value'));
              return { name, role };
            })
          );

          expect(usersRooms).toContainEqual({ name: room1.name, role: 30 }); // old Role 20 has been updated to new one: 30
          expect(usersRooms).toContainEqual({ name: room2.name, role: 30 });
          expect(usersRooms).toHaveLength(3); // (1) Standard Room and (2) CSV import destination Room and (3) CSV import destination Room-2

          await RoomSelector.getByTestId('room-roles-dialog-cancel-button').click();
        }
        await adminPage.getByTestId('cancel-user-form').click();
      }
    });

    await test.step('Imported Users should be able to login and set password', async () => {
      for (const user of csvUsers) {
        const page = await newPageFor(user.username);
        await page.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
        await users.ensureSpecificInstanceEntered(page, dbInstanceCode);
        await users.firstLoginFlow(page, user, user.tempPass!!);
        await ensureStatePathFor(user.username);
      }
    });

    await test.step('Imported Users should be able to create a wild idea in the standard room', async () => {
      for (const user of csvUsers) {
        const page = await newPageFor(user.username);
        await navigation.goToRoom(page, 'Schule');
        await ideas.create(page, {
          name: `test-${user.username}`,
          description: 'Idea created by csv import test',
        });
      }
    });

    await test.step('Imported Users should be able to create a wild idea in the destination room', async () => {
      for (const user of csvUsers) {
        const page = await newPageFor(user.username);
        await navigation.goToRoom(page, room1.name);
        await ideas.create(page, {
          name: `test-${user.username}`,
          description: 'Idea created by csv import test',
        });
      }
    });
  });
});

const createTempCsvFile = (csvContent: string): string => {
  const generatedTestDataDir = path.join(process.cwd(), 'tests/generated-test-data');
  fs.mkdirSync(generatedTestDataDir, { recursive: true });
  const filePath = path.join(generatedTestDataDir, `csv-import-users-${shared.gensym()}.csv`);

  fs.writeFileSync(filePath, csvContent);
  return filePath;
};
