import { TEST_IDS } from '../../../src/test-ids';
import { test, expect } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as rooms from '../../interactions/admin-settings/rooms';
import * as navigation from '../../interactions/navigation';

/**
 * Room Management Tests
 * Tests room creation, access control, and deletion
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create room → 2. Access room → 3. Delete room → 4. Verify deletion
 */
test.describe.serial('Room Management - Creation and Permissions', () => {
  test('Admin can create/delete a room with user', async ({ seededUser, newPageFor }) => {
    const adminPage = await newPageFor('admin');
    const userPage = await newPageFor('user');
    const room = entities.createRoom('room-tests.new-room', [{ username: seededUser.username }]);

    await test.step('Admin - Create room via UI', async () => {
      await rooms.create(adminPage, room);
    });

    await test.step('User - Navigate to created room', async () => {
      await navigation.goToRoom(userPage, room.name);
      // the room name only surfaces in the breadcrumb toggle's accessible name
      await expect(userPage.getByTestId(TEST_IDS.BREADCRUMB_TOGGLE)).toHaveAccessibleName(new RegExp(room.name));
    });

    await test.step('Admin - Delete room via settings', async () => {
      await rooms.remove(adminPage, room);
    });

    await test.step('User - Verify room is no longer accessible', async () => {
      await navigation.goToHome(userPage);
      await expect(navigation.goToRoom(userPage, room.name)).rejects.toThrow();
    });
  });

  test('User cannot access Rooms Settings', async ({ newPageFor }) => {
    const userPage = await newPageFor('user');

    await navigation.goToRoomsSettings(userPage);

    await expect(userPage.getByTestId('add-rooms-button')).not.toBeVisible();
    await expect(userPage.getByTestId('not-found-view')).toBeVisible();
  });
});
