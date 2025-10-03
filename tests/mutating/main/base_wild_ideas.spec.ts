import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import * as rooms from '../../shared/interactions/rooms';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

describeWithSetup('Idea Management - CRUD Operations and Permissions', () => {
  let adminPage: any;
  let user1Page: any;
  let user2Page: any;

  const room = entities.createRoom('idea-tests');
  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const userIdeaComment = 'This is a comment from user on their own idea.';
  const adminIdeaComment = 'This is a comment from admin on their own idea.';

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('other-user');
    // Cache browser pages for reuse
    adminPage = await browsers.getUserBrowser('admin');
    user1Page = await browsers.getUserBrowser(user1Data.username);
    user2Page = await browsers.getUserBrowser(user2Data.username);

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
      await ideas.remove(adminPage, room, adminIdea);
    }
    if (cleanupQueue.userIdea) {
      cleanupQueue.userIdea = false;
      await ideas.remove(user1Page, room, userIdea);
    }
    if (cleanupQueue.room) {
      cleanupQueue.room = false;
      await rooms.remove(adminPage, room);
    }
  };

  test('Admin can create an idea', async () => {
    await rooms.create(adminPage, room);
    cleanupQueue.room = true;

    await ideas.create(adminPage, room, adminIdea);
    cleanupQueue.adminIdea = true;
  });

  test('Users can create an idea', async () => {
    await ideas.create(user1Page, room, userIdea);
    cleanupQueue.userIdea = true;
  });

  test('Users cannot delete other users ideas', async () => {
    await expect(async () => {
      await ideas.remove(user2Page, room, userIdea);
    }).rejects.toThrow();
  });

  test('Users can add comments to ideas', async () => {
    await navigation.goToWildIdea(user1Page, room.name, adminIdea.name);
    await ideas.comment(user1Page, adminIdeaComment);

    await navigation.goToWildIdea(user2Page, room.name, userIdea.name);
    await ideas.comment(user2Page, userIdeaComment);
  });

  test('Users can delete their own comments', async () => {
    await navigation.goToWildIdea(user1Page, room.name, adminIdea.name);
    await ideas.removeComment(user1Page, adminIdeaComment);
  });

  test('Users cannot delete other users comments', async () => {
    await navigation.goToWildIdea(user1Page, room.name, userIdea.name);
    await expect(async () => {
      await ideas.removeComment(user1Page, userIdeaComment);
    }).rejects.toThrow();
  });

  test('Admin can delete an idea', async () => {
    await ideas.remove(adminPage, room, adminIdea);
    cleanupQueue.adminIdea = false;
  });

  test('User can delete their own idea', async () => {
    await ideas.remove(user1Page, room, userIdea);
    cleanupQueue.userIdea = false;
  });

  test('Cleanup after tests', async () => {
    await cleanup();
  });
});
