import { expect, test } from '../../fixtures/test-fixtures';
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
test.describe.serial('Idea Management', () => {
  let roomContext: roomsFixture.RoomContext;

  const adminIdea = entities.createIdea('admin');
  const userIdea = entities.createIdea('user');
  const commentOfStudentOnUsersIdea = 'This is a comment from user on their own idea.';
  const commentOfUserOnAdminsIdea = 'This is a comment from User on Admins Idea.';

  test.beforeAll('Setup Room Context', async ({ adminPage, userConfig, studentConfig }) => {
    // Setup shared room context on first test
    if (!roomContext) {
      roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'idea-tests');
    }
  });

  test.describe('Creation 🧒👉👈🧙', () => {
    test('From Room page, Admin can create Idea', async ({ adminPage }) => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await ideas.create(adminPage, adminIdea);
    });

    test('From Room page, User can create an Idea', async ({ userPage }) => {
      await navigation.goToRoom(userPage, roomContext.room.name);
      await ideas.create(userPage, userIdea);
    });
  });

  test('Comments', async ({ userPage, studentPage }) => {
    await test.step("User comments on Admin's Idea", async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
      await ideas.comment(userPage, commentOfUserOnAdminsIdea);
    });

    await test.step("Student comments on User's Idea", async () => {
      await navigation.goToWildIdea(studentPage, roomContext.room.name, userIdea.name);
      await ideas.comment(studentPage, commentOfStudentOnUsersIdea);
    });

    await test.step('User can delete own comment', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
      await ideas.removeComment(userPage, commentOfUserOnAdminsIdea);
    });

    await test.step("User shouldn't be able to delete another User's Comment", async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, userIdea.name);
      await expect(async () => {
        await ideas.removeComment(userPage, commentOfStudentOnUsersIdea);
      }).rejects.toThrow();
    });
  });

  test.describe('Deletion of Ideas', () => {
    test("User shouldn't be able to delete another User's Idea", async ({ studentPage }) => {
      await expect(async () => {
        await ideas.remove(studentPage, roomContext.room, userIdea);
      }).rejects.toThrow();
    });

    test('Admin can delete own Idea', async ({ adminPage }) => {
      await ideas.remove(adminPage, roomContext.room, adminIdea);
    });

    test('User can delete own Idea', async ({ userPage }) => {
      await ideas.remove(userPage, roomContext.room, userIdea);
    });
  });
});
