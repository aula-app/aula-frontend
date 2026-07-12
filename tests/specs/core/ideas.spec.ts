import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as formInteractions from '../../interactions/forms';
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

/**
 * Idea Draft Persistence Tests
 * The idea form keeps an in-progress draft in sessionStorage, so dismissing the
 * modal or reloading does not lose typed content; cancel is an explicit discard.
 */
test('Idea draft persistence', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const draft = entities.createIdea('draft');

  const openIdeaForm = async () => {
    await formInteractions.clickButton(userPage, TEST_IDS.ADD_IDEA_BUTTON);
    await expect(userPage.getByTestId('idea-form')).toBeVisible();
  };

  // Clicking the backdrop dismisses the modal without going through the form's
  // cancel button — the accidental dismissal the draft exists to survive.
  const dismissIdeaForm = async () => {
    await userPage.mouse.click(10, 10);
    await expect(userPage.getByTestId('idea-form')).toBeHidden();
  };

  await test.step('User - Type an idea and dismiss the modal without cancelling', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await openIdeaForm();

    await userPage.getByTestId('idea-form-title').fill(draft.name);
    await userPage.getByTestId('idea-form-content').locator('[contenteditable="true"]').fill(draft.description);

    await dismissIdeaForm();
  });

  await test.step('User - Draft is restored when the form reopens', async () => {
    await openIdeaForm();

    await expect(userPage.getByTestId('idea-form-title')).toHaveValue(draft.name);
    await expect(userPage.getByTestId('idea-form-content')).toContainText(draft.description);

    await dismissIdeaForm();
  });

  await test.step('User - Draft survives a page reload', async () => {
    await userPage.reload();
    await openIdeaForm();

    await expect(userPage.getByTestId('idea-form-title')).toHaveValue(draft.name);
    await expect(userPage.getByTestId('idea-form-content')).toContainText(draft.description);
  });

  await test.step('User - Cancel discards the draft', async () => {
    await formInteractions.clickButton(userPage, 'idea-form-cancel');
    await expect(userPage.getByTestId('idea-form')).toBeHidden();

    await openIdeaForm();

    await expect(userPage.getByTestId('idea-form-title')).toHaveValue('');
    await expect(userPage.getByTestId('idea-form-content')).not.toContainText(draft.description);
  });
});
