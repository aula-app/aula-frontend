import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

/**
 * Idea Management Tests
 * Tests idea creation, deletion, comments, and permissions
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Create ideas → Add comments → Delete comments → Delete ideas
 */
test.describe.serial('Idea Management - CRUD Operations and Permissions', () => {
  let roomContext: roomsFixture.RoomContext;

  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const userIdeaComment = 'This is a comment from user on their own idea.';
  const adminIdeaComment = 'This is a comment from admin on their own idea.';

  test('Admin can create an idea', async ({ adminPage, userConfig, studentConfig }) => {
    await test.step('Setup room context', async () => {
      // Setup shared room context on first test
      if (!roomContext) {
        roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'idea-tests');
      }
    });

    await test.step('Navigate to room', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
    });

    await test.step('Create idea', async () => {
      await ideas.create(adminPage, adminIdea);
    });
  });

  test('Users can create an idea', async ({ userPage }) => {
    await test.step('Navigate to room', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
    });

    await test.step('Create idea', async () => {
      await ideas.create(userPage, userIdea);
    });
  });

  test('Users cannot delete other users ideas', async ({ studentPage }) => {
    await test.step('Attempt to delete another user\'s idea', async () => {
      await expect(async () => {
        await ideas.remove(studentPage, roomContext.room, userIdea);
      }).rejects.toThrow();
    });
  });

  test('Users can add comments to ideas', async ({ userPage, studentPage }) => {
    await test.step('User comments on admin idea', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
      await ideas.comment(userPage, adminIdeaComment);
    });

    await test.step('Student comments on user idea', async () => {
      await navigation.goToWildIdea(studentPage, roomContext.room.name, userIdea.name);
      await ideas.comment(studentPage, userIdeaComment);
    });
  });

  test('Users can delete their own comments', async ({ userPage }) => {
    await test.step('Navigate to idea with comment', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
    });

    await test.step('Delete own comment', async () => {
      await ideas.removeComment(userPage, adminIdeaComment);
    });
  });

  test('Users cannot delete other users comments', async ({ userPage }) => {
    await test.step('Navigate to idea with other user\'s comment', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, userIdea.name);
    });

    await test.step('Attempt to delete another user\'s comment', async () => {
      await expect(async () => {
        await ideas.removeComment(userPage, userIdeaComment);
      }).rejects.toThrow();
    });
  });

  test('Admin can delete an idea', async ({ adminPage }) => {
    await test.step('Delete admin idea', async () => {
      await ideas.remove(adminPage, roomContext.room, adminIdea);
    });
  });

  test('User can delete their own idea', async ({ userPage }) => {
    await test.step('Delete own idea', async () => {
      await ideas.remove(userPage, roomContext.room, userIdea);
    });
  });
});
