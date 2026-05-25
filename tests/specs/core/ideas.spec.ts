import { expect, test } from '../../fixtures/db-backchannel/new-fixture';
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

  test('Idea Management', async ({ seededRoom, newPageFor }) => {
    const adminPage = await newPageFor('admin');
    const userPage = await newPageFor('user');
    const studentPage = await newPageFor('student');
    const adminIdea = entities.createIdea('admin');
    const userIdea = entities.createIdea('user');
    const commentOfStudentOnUsersIdea = 'This is a comment from user on their own idea.';
    const commentOfUserOnAdminsIdea = 'This is a comment from User on Admins Idea.';

    await test.step('Admin - From Room page, Admin can create Idea', async () => {
      await navigation.goToRoom(adminPage, seededRoom.name);
      await ideas.create(adminPage, adminIdea);
    });

    await test.step('User - From Room page, User can create an Idea', async () => {
      await navigation.goToRoom(userPage, seededRoom.name);
      await ideas.create(userPage, userIdea);
    });

    await test.step("User comments on Admin's Idea", async () => {
      await navigation.goToWildIdea(userPage, seededRoom.name, adminIdea.name);
      await ideas.comment(userPage, commentOfUserOnAdminsIdea);
    });

    await test.step("Student comments on User's Idea", async () => {
      await navigation.goToWildIdea(studentPage, seededRoom.name, userIdea.name);
      await ideas.comment(studentPage, commentOfStudentOnUsersIdea);
    });

    await test.step('User can delete own comment', async () => {
      await navigation.goToWildIdea(userPage, seededRoom.name, adminIdea.name);
      await ideas.removeComment(userPage, commentOfUserOnAdminsIdea);
    });

    await test.step("User shouldn't be able to delete another User's Comment", async () => {
      await navigation.goToWildIdea(userPage, seededRoom.name, userIdea.name);
      await expect(ideas.removeComment(userPage, commentOfStudentOnUsersIdea)).rejects.toThrow();
    });

    await test.step("User shouldn't be able to delete another User's Idea", async () => {
      await expect(ideas.remove(studentPage, seededRoom, userIdea)).rejects.toThrow();
    });

    await test.step('Admin can delete own Idea', async () => {
      await ideas.remove(adminPage, seededRoom, adminIdea);
    });

    await test.step('User can delete own Idea', async () => {
      await ideas.remove(userPage, seededRoom, userIdea);
    });
  });
});
