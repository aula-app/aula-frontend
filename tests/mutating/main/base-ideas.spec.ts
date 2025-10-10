import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import * as rooms from '../../shared/interactions/rooms';

describeWithSetup('Idea Management - CRUD Operations and Permissions', () => {
  let admin: any;
  let user: any;
  let user2: any;

  const room = entities.createRoom('idea-tests');
  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const userIdeaComment = 'This is a comment from user on their own idea.';
  const adminIdeaComment = 'This is a comment from admin on their own idea.';

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('other-user');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);
    user2 = await browsers.getUserBrowser(user2Data.username);

    room.users = [user1Data, user2Data];
  });

  test.afterAll(async () => {
    await cleanup();
  });

  const cleanupQueue = {
    room: false,
    adminIdea: false,
    userIdea: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.adminIdea) {
      cleanupQueue.adminIdea = false;
      await ideas.remove(admin, room, adminIdea);
    }
    if (cleanupQueue.userIdea) {
      cleanupQueue.userIdea = false;
      await ideas.remove(user, room, userIdea);
    }
    if (cleanupQueue.room) {
      cleanupQueue.room = false;
      await rooms.remove(admin, room);
    }
  };

  test('Admin can create an idea', async () => {
    await rooms.create(admin, room);
    cleanupQueue.room = true;

    await ideas.create(admin, room, adminIdea);
    cleanupQueue.adminIdea = true;
  });

  test('Users can create an idea', async () => {
    await ideas.create(user, room, userIdea);
    cleanupQueue.userIdea = true;
  });

  test('Users cannot delete other users ideas', async () => {
    await expect(async () => {
      await ideas.remove(user2, room, userIdea);
    }).rejects.toThrow();
  });

  test('Users can add comments to ideas', async () => {
    await navigation.goToWildIdea(user, room.name, adminIdea.name);
    await ideas.comment(user, adminIdeaComment);

    await navigation.goToWildIdea(user2, room.name, userIdea.name);
    await ideas.comment(user2, userIdeaComment);
  });

  test('Users can delete their own comments', async () => {
    await navigation.goToWildIdea(user, room.name, adminIdea.name);
    await ideas.removeComment(user, adminIdeaComment);
  });

  test('Users cannot delete other users comments', async () => {
    await navigation.goToWildIdea(user, room.name, userIdea.name);
    await expect(async () => {
      await ideas.removeComment(user, userIdeaComment);
    }).rejects.toThrow();
  });

  test('Admin can delete an idea', async () => {
    await ideas.remove(admin, room, adminIdea);
    cleanupQueue.adminIdea = false;
  });

  test('User can delete their own idea', async () => {
    await ideas.remove(user, room, userIdea);
    cleanupQueue.userIdea = false;
  });

  test('Cleanup after tests', async () => {
    await cleanup();
  });
});
