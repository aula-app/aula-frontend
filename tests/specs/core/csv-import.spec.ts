import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import fs from 'fs';
import path from 'path';
import { RoomData, UserData } from '../../support/types';
import { admin } from '../../fixtures/user.fixture';
import { createTestApiClient } from '../../helpers/api-client';
import * as entities from '../../helpers/entities';
import * as formInteractions from '../../interactions/forms';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as settingsInteractions from '../../interactions/settings';
import * as users from '../../interactions/users';

/**
 * CSV Import Tests
 * Tests CSV user import, duplicate handling, room assignments, and permissions
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Upload CSV → Verify import → Re-import (test duplicates) → Test imported users
 */
test.describe.serial('CSV Import', () => {
  const apiClient = createTestApiClient();
  let room: RoomData;
  let csvUsers: Array<UserData>;
  let csvFilePath: string;

  test.beforeAll(async () => {
    // prepare data locally
    room = entities.createRoom('csv-import-destination');
    csvUsers = Array.from({ length: 3 }, (_, i) => entities.createUserData(`csv-import-${i}`));
    // skip emails
    const csvUsersFormatted = csvUsers.map((u) => `${u.realName};${u.displayName};${u.username};;${u.about}`);
    csvFilePath = createTempCsvFile(`realname;displayname;username;email;about_me\n` + csvUsersFormatted.join('\n'));

    // issue API requests to setup environment (no page needed, uses API)
    await apiClient.login(admin.username, admin.password);
    await apiClient.addRoom({
      room_name: room.name,
      description_public: room.description,
      description_internal: room.description,
    });
  });

  test.afterAll(async () => {
    // Clean up temporary CSV file only (teardown handles rooms/users/ideas)
    if (csvFilePath && fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
    }
  });

  test.describe('Admin', () => {
    test('should be able to upload CSV file', async ({ adminPage }) => {
      await test.step('Navigate to CSV upload settings', async () => {
        await navigation.goToSettings(adminPage);
        await navigation.openAccordion(adminPage, 'config-accordion-user');
      });

      await test.step('Upload CSV file and assign to room', async () => {
        await formInteractions.clickButton(adminPage, 'upload-users-csv-button');
        await adminPage.locator('input[type="file"]').setInputFiles(csvFilePath);
        await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room.name);
        await formInteractions.clickButton(adminPage, 'confirm_upload');
      });
    });

    test('should be able to confirm imported users are added to the destination room', async ({ adminPage }) => {
      await test.step('Verify users in room settings', async () => {
        await navigation.goToRoomsSettings(adminPage);
        await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'room_name', value: room.name } });

        const UserSelector = adminPage.getByTestId('users-field');
        await expect(UserSelector).toBeVisible();
        const usersNames = await UserSelector.locator('div div :not(legend) > span').allTextContents();
        const csvRealNames = csvUsers.map((c) => c.realName);
        expect(csvRealNames).toEqual(expect.arrayContaining(usersNames));
        expect(usersNames).toEqual(expect.arrayContaining(csvRealNames));
      });
    });

    test('should capture temp password of the imported users', async ({ adminPage }) => {
      await test.step('Retrieve temp passwords for CSV users', async () => {
        for (const u of csvUsers) {
          u.tempPass = await users.getTemporaryPass(adminPage, u);
        }
      });
    });

    test('should be able to confirm that imported users should have no other rooms assigned', async ({ adminPage }) => {
      await test.step('Verify room assignments', async () => {
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

          expect(usersRooms).toContainEqual({ name: room.name, role: 20 });
          expect(usersRooms).toHaveLength(2); // (1) Standard Room and (2) CSV import destination Room

          await RoomSelector.getByTestId('room-roles-dialog-cancel-button').click();
          await adminPage.getByTestId('cancel-user-form').click();
        }
      });
    });
  });

  test.describe('Admin222 (same CSV, +1 user +1 room +1 role)', () => {
    let room2: RoomData;

    test.beforeAll(async () => {
      room2 = entities.createRoom('csv-import-destination-2');
      await apiClient.addRoom({
        room_name: room2.name,
        description_public: room2.description,
        description_internal: room2.description,
      });

      csvUsers.push(entities.createUserData('csv-import-NEW-4'));
      const csvUsersFormatted = csvUsers.map((u) => `${u.realName};${u.displayName};${u.username};;${u.about}`);
      csvFilePath = createTempCsvFile(`any;header;name;should;work\n` + csvUsersFormatted.join('\n'));
    });

    test('should be able to upload CSV file (role=moderator)', async ({ adminPage }) => {
      await test.step('Navigate to CSV upload settings', async () => {
        await navigation.goToSettings(adminPage);
        await navigation.openAccordion(adminPage, 'config-accordion-user');
      });

      await test.step('Upload CSV with multiple rooms and role', async () => {
        await formInteractions.clickButton(adminPage, 'upload-users-csv-button');
        await adminPage.locator('input[type="file"]').setInputFiles(csvFilePath);
        await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room.name);
        await adminPage.waitForTimeout(500); // Wait for UI to update after first selection
        await formInteractions.selectOption(adminPage, 'user-room-autocomplete', room2.name);
        await adminPage.waitForTimeout(500); // Wait for UI to update after second selection
        await formInteractions.selectOptionByValue(adminPage, 'select-field-role', '30');
        await formInteractions.clickButton(adminPage, 'confirm_upload');
      });
    });

    test('should be able to confirm imported users are added to the destination room2', async ({ adminPage }) => {
      await test.step('Verify users in room2 settings', async () => {
        await navigation.goToRoomsSettings(adminPage);
        await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'room_name', value: room2.name } });

        const UserSelector = adminPage.getByTestId('users-field');
        await expect(UserSelector).toBeVisible();
        const usersNames = await UserSelector.locator('div div :not(legend) > span').allTextContents();
        const csvRealNames = csvUsers.map((c) => c.realName);
        expect(csvRealNames).toEqual(expect.arrayContaining(usersNames));
        expect(usersNames).toEqual(expect.arrayContaining(csvRealNames));
      });
    });

    test('should verify users are not duplicated or recreated (their temp password is unchanged)', async ({ adminPage }) => {
      await test.step('Check temp passwords for duplication', async () => {
        for (const u of csvUsers) {
          // this will also inherently verify that no duplicate users were created because it checks
          // locator('...').textContent()! which will fail if there's multiple DOMs matched by the locator
          const currentPass = await users.getTemporaryPass(adminPage, u);

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
    });

    test('should be able to confirm that imported users are assigned to old and new rooms only', async ({ adminPage }) => {
      await test.step('Verify room assignments for all users', async () => {
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

            expect(usersRooms).toContainEqual({ name: room.name, role: 30 }); // old Role 20 has been updated to new one: 30
            expect(usersRooms).toContainEqual({ name: room2.name, role: 30 });
            expect(usersRooms).toHaveLength(3); // (1) Standard Room and (2) CSV import destination Room and (3) CSV import destination Room-2

            await RoomSelector.getByTestId('room-roles-dialog-cancel-button').click();
          }
          await adminPage.getByTestId('cancel-user-form').click();
        }
      });
    });
  });

  test.describe('imported users', () => {
    test('should be able to login and set password', async ({ createUserPage }) => {
      await test.step('Complete first login flow for all CSV users', async () => {
        for (const user of csvUsers) {
          const page = await createUserPage(user.username);
          await users.firstLoginFlow(page, user, user.tempPass!!);
        }
      });
    });

    test('should be able to create a wild idea in the standard room', async ({ createUserPage }) => {
      await test.step('Create ideas in standard room', async () => {
        for (const user of csvUsers) {
          const page = await createUserPage(user.username);
          await navigation.goToRoom(page, 'Schule');
          await ideas.create(page, {
            name: `test-${user.username}`,
            description: 'Idea created by csv import test',
          });
        }
      });
    });

    test('should be able to create a wild idea in the destination room', async ({ createUserPage }) => {
      await test.step('Create ideas in destination room', async () => {
        for (const user of csvUsers) {
          const page = await createUserPage(user.username);
          await navigation.goToRoom(page, room.name);
          await ideas.create(page, {
            name: `test-${user.username}`,
            description: 'Idea created by csv import test',
          });
        }
      });
    });
  });

  const createTempCsvFile = (csvContent: string): string => {
    const filePath = path.join(__dirname, '../../../auth-states', 'csv-import-users.csv');

    // Ensure temp directory exists
    const tempDir = path.dirname(filePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent);
    return filePath;
  };
});
