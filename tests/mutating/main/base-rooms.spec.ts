import { test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as rooms from '../../shared/interactions/rooms';
import * as navigation from '../../shared/interactions/navigation';

describeWithSetup('Room Management - Creation and Permissions', () => {
  let admin: any;
  let user: any;

  const room = entities.createRoom('room-tests');

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);

    room.users = [user1Data];
  });

  test.afterAll(async () => {
    await cleanup();
  });

  const cleanupQueue = {
    room: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.room) {
      cleanupQueue.room = false;
      await rooms.remove(admin, room);
    }
  };

  test('Admin can create a room with users', async () => {
    await rooms.create(admin, room);
    cleanupQueue.room = true;
  });

  test('User can access the new room', async () => {
    await navigation.goToRoom(user, room.name);
  });

  test('User cannot create a room', async () => {
    await test.expect(rooms.create(user, entities.createRoom('unauthorized-room'))).rejects.toThrow();
  });

  test('Admin can delete a room with users', async () => {
    await rooms.remove(admin, room);
    cleanupQueue.room = false;
  });

  test('User cannot access deleted room', async () => {
    await navigation.goToHome(user);
    await test.expect(navigation.goToRoom(user, room.name)).rejects.toThrow();
  });
});
