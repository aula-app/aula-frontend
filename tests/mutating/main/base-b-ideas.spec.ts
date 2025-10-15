import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import * as rooms from '../../fixtures/rooms';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';

describeWithSetup('Idea Management - CRUD Operations and Permissions', () => {
  let admin: any;
  let user: any;
  let otherUser: any;
  let roomContext: rooms.RoomContext;

  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const userIdeaComment = 'This is a comment from user on their own idea.';
  const adminIdeaComment = 'This is a comment from admin on their own idea.';

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('student');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);
    otherUser = await browsers.getUserBrowser(user2Data.username);

    // Setup shared room context
    roomContext = await rooms.setupRoomContext(admin, [user1Data, user2Data], 'idea-tests');
  });

  test.afterAll(async () => {
    await cleanup();
  });

  const cleanupQueue = {
    adminIdea: false,
    userIdea: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.adminIdea) {
      cleanupQueue.adminIdea = false;
      await ideas.remove(admin, roomContext.room, adminIdea);
    }
    if (cleanupQueue.userIdea) {
      cleanupQueue.userIdea = false;
      await ideas.remove(user, roomContext.room, userIdea);
    }
    // Cleanup room context
    await roomContext.cleanup();
  };

  test('Admin can create an idea', async () => {
    await navigation.goToRoom(admin, roomContext.room.name);
    await ideas.create(admin, adminIdea);
    cleanupQueue.adminIdea = true;
  });

  test('Users can create an idea', async () => {
    await navigation.goToRoom(user, roomContext.room.name);
    await ideas.create(user, userIdea);
    cleanupQueue.userIdea = true;
  });

  test('Users cannot delete other users ideas', async () => {
    await expect(async () => {
      await ideas.remove(otherUser, roomContext.room, userIdea);
    }).rejects.toThrow();
  });

  test('Users can add comments to ideas', async () => {
    await navigation.goToWildIdea(user, roomContext.room.name, adminIdea.name);
    await ideas.comment(user, adminIdeaComment);

    await navigation.goToWildIdea(otherUser, roomContext.room.name, userIdea.name);
    await ideas.comment(otherUser, userIdeaComment);
  });

  test('Users can delete their own comments', async () => {
    await navigation.goToWildIdea(user, roomContext.room.name, adminIdea.name);
    await ideas.removeComment(user, adminIdeaComment);
  });

  test('Users cannot delete other users comments', async () => {
    await navigation.goToWildIdea(user, roomContext.room.name, userIdea.name);
    await expect(async () => {
      await ideas.removeComment(user, userIdeaComment);
    }).rejects.toThrow();
  });

  test('Admin can delete an idea', async () => {
    await ideas.remove(admin, roomContext.room, adminIdea);
    cleanupQueue.adminIdea = false;
  });

  test('User can delete their own idea', async () => {
    await ideas.remove(user, roomContext.room, userIdea);
    cleanupQueue.userIdea = false;
  });
});
