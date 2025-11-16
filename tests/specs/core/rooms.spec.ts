import { test, expect } from '../../fixtures/test-fixtures';
import { describeWithSetup } from '../../lifecycle/base-test';
import * as entities from '../../helpers/entities';
import * as rooms from '../../interactions/rooms';
import * as navigation from '../../interactions/navigation';

describeWithSetup('Room Management - Creation and Permissions', () => {
  const room = entities.createRoom('room-tests');

  test.beforeAll(async ({ userConfig }) => {
    room.users = [userConfig];
  });

  test('Admin can create a room with users', async ({ adminPage }) => {
    await rooms.create(adminPage, room);
  });

  test('User can access the new room', async ({ userPage }) => {
    await navigation.goToRoom(userPage, room.name);
  });

  test('User cannot create a room', async ({ userPage }) => {
    await expect(rooms.create(userPage, entities.createRoom('unauthorized-room'))).rejects.toThrow();
  });

  test('Admin can delete a room with users', async ({ adminPage }) => {
    await rooms.remove(adminPage, room);
  });

  test('User cannot access deleted room', async ({ userPage }) => {
    await navigation.goToHome(userPage);
    await expect(navigation.goToRoom(userPage, room.name)).rejects.toThrow();
  });
});
