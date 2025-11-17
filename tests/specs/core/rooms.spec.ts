import { test, expect } from '../../fixtures/test-fixtures';
import * as entities from '../../helpers/entities';
import * as rooms from '../../interactions/rooms';
import * as navigation from '../../interactions/navigation';

/**
 * Room Management Tests
 * Tests room creation, access control, and deletion
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create room → 2. Access room → 3. Delete room → 4. Verify deletion
 */
test.describe.serial('Room Management - Creation and Permissions', () => {
  const room = entities.createRoom('room-tests');

  test.beforeAll(async ({ userConfig }) => {
    room.users = [userConfig];
  });

  test('Admin can create a room with users', async ({ adminPage }) => {
    await test.step('Create room via UI', async () => {
      await rooms.create(adminPage, room);
    });
  });

  test('User can access the new room', async ({ userPage }) => {
    await test.step('Navigate to created room', async () => {
      await navigation.goToRoom(userPage, room.name);
    });

    await test.step('Verify room is accessible', async () => {
      await expect(userPage.getByText(room.name)).toBeVisible();
    });
  });

  test('User cannot create a room', async ({ userPage }) => {
    await test.step('Attempt to create room as non-admin', async () => {
      await expect(rooms.create(userPage, entities.createRoom('unauthorized-room'))).rejects.toThrow();
    });
  });

  test('Admin can delete a room with users', async ({ adminPage }) => {
    await test.step('Delete room via settings', async () => {
      await rooms.remove(adminPage, room);
    });
  });

  test('User cannot access deleted room', async ({ userPage }) => {
    await test.step('Return to home page', async () => {
      await navigation.goToHome(userPage);
    });

    await test.step('Verify room is no longer accessible', async () => {
      await expect(navigation.goToRoom(userPage, room.name)).rejects.toThrow();
    });
  });
});
