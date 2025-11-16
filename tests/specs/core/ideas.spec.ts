import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import { describeWithSetup } from '../../lifecycle/base-test';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

describeWithSetup('Idea Management - CRUD Operations and Permissions', () => {
  let roomContext: roomsFixture.RoomContext;

  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const userIdeaComment = 'This is a comment from user on their own idea.';
  const adminIdeaComment = 'This is a comment from admin on their own idea.';

  test.beforeAll(async ({ adminPage, userConfig, studentConfig }) => {
    // Setup shared room context
    roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'idea-tests');
  });

  test('Admin can create an idea', async ({ adminPage }) => {
    await navigation.goToRoom(adminPage, roomContext.room.name);
    await ideas.create(adminPage, adminIdea);
  });

  test('Users can create an idea', async ({ userPage }) => {
    await navigation.goToRoom(userPage, roomContext.room.name);
    await ideas.create(userPage, userIdea);
  });

  test('Users cannot delete other users ideas', async ({ studentPage }) => {
    await expect(async () => {
      await ideas.remove(studentPage, roomContext.room, userIdea);
    }).rejects.toThrow();
  });

  test('Users can add comments to ideas', async ({ userPage, studentPage }) => {
    await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
    await ideas.comment(userPage, adminIdeaComment);

    await navigation.goToWildIdea(studentPage, roomContext.room.name, userIdea.name);
    await ideas.comment(studentPage, userIdeaComment);
  });

  test('Users can delete their own comments', async ({ userPage }) => {
    await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
    await ideas.removeComment(userPage, adminIdeaComment);
  });

  test('Users cannot delete other users comments', async ({ userPage }) => {
    await navigation.goToWildIdea(userPage, roomContext.room.name, userIdea.name);
    await expect(async () => {
      await ideas.removeComment(userPage, userIdeaComment);
    }).rejects.toThrow();
  });

  test('Admin can delete an idea', async ({ adminPage }) => {
    await ideas.remove(adminPage, roomContext.room, adminIdea);
  });

  test('User can delete their own idea', async ({ userPage }) => {
    await ideas.remove(userPage, roomContext.room, userIdea);
  });
});
