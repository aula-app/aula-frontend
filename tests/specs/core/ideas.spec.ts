import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

/**
 * Idea Management Tests
 * Tests idea creation, deletion, comments, and permissions
 * Uses pure Playwright fixtures for setup/teardown
 */
test('Idea Management', async ({ seededRoom, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');

  const adminIdea = entities.createIdea('admin');
  const userIdea1 = entities.createIdea('user_idea.1');
  const userIdea2 = entities.createIdea('user_idea.2');
  const commentOfStudentOnUsersIdea = 'This is a comment from user on their own idea.';
  const commentOfUserOnAdminsIdea = 'This is a comment from User on Admins Idea.';

  await test.step('Admin - From Room page, Admin can create Idea', async () => {
    await navigation.goToRoom(adminPage, seededRoom.name);
    await ideas.create(adminPage, adminIdea);
  });

  await test.step('User - From Room page, User can create Ideas', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, userIdea1);
    await ideas.create(userPage, userIdea2);
  });

  await test.step("User comments on Admin's Idea", async () => {
    await navigation.goToWildIdea(userPage, seededRoom.name, adminIdea.name);
    await ideas.comment(userPage, commentOfUserOnAdminsIdea);
  });

  await test.step('User can delete own comment', async () => {
    await navigation.goToWildIdea(userPage, seededRoom.name, adminIdea.name);
    await ideas.removeComment(userPage, commentOfUserOnAdminsIdea);
  });

  await test.step("Student comments on User's Idea", async () => {
    await navigation.goToWildIdea(studentPage, seededRoom.name, userIdea1.name);
    await ideas.comment(studentPage, commentOfStudentOnUsersIdea);
  });

  await test.step("User shouldn't be able to delete another User's Comment", async () => {
    await navigation.goToWildIdea(userPage, seededRoom.name, userIdea1.name);
    await expect(ideas.removeComment(userPage, commentOfStudentOnUsersIdea)).rejects.toThrow();
  });

  await test.step("User shouldn't be able to delete another User's Idea", async () => {
    await expect(ideas.remove(studentPage, seededRoom, userIdea1)).rejects.toThrow();
  });

  await test.step('Admin can delete own Idea', async () => {
    await ideas.remove(adminPage, seededRoom, adminIdea);
  });

  await test.step('Admin can delete User\'s Idea', async () => {
    await ideas.remove(adminPage, seededRoom, userIdea1);
  });

  await test.step('User can delete own Idea', async () => {
    await ideas.remove(userPage, seededRoom, userIdea2);
  });
});
