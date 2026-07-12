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
 * More-Options Panel Tests
 * Focus management, Escape/outside-click closing, and permission gating of the
 * edit/delete/report actions.
 */
test('Idea more-options panel behavior', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');
  const idea = entities.createIdea('more-options');

  const IdeaDiv = userPage.getByTestId(`idea-${idea.name}`);
  const MoreToggle = IdeaDiv.getByTestId(TEST_IDS.IDEA_MORE_MENU);
  // the closed panel is clipped + inert, not hidden — assert inert instead of visibility
  const MorePanel = IdeaDiv.getByTestId(TEST_IDS.IDEA_MORE_OPTIONS_PANEL);

  await test.step('User - Create an Idea to inspect', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);
  });

  await test.step('User - Toggle opens the panel and moves focus into it', async () => {
    await MoreToggle.click();

    await expect(MoreToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(MorePanel).not.toHaveAttribute('inert');
    await expect(IdeaDiv.getByTestId(TEST_IDS.EDIT_BUTTON)).toBeVisible();
    await expect(IdeaDiv.getByTestId(TEST_IDS.DELETE_BUTTON)).toBeVisible();
    await expect(IdeaDiv.getByTestId(TEST_IDS.REPORT_BUTTON)).toBeVisible();
    await expect(IdeaDiv.getByTestId(TEST_IDS.EDIT_BUTTON)).toBeFocused();
  });

  await test.step('User - Escape closes the panel and returns focus to the toggle', async () => {
    await userPage.keyboard.press('Escape');

    await expect(MoreToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(MorePanel).toHaveAttribute('inert', '');
    await expect(MoreToggle).toBeFocused();
  });

  await test.step('User - Clicking outside closes the panel', async () => {
    await MoreToggle.click();
    await expect(MoreToggle).toHaveAttribute('aria-expanded', 'true');

    await userPage.locator('h1').click();

    await expect(MoreToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(MorePanel).toHaveAttribute('inert', '');
  });

  await test.step("Student - Only sees report on another User's Idea", async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);

    const StudentIdeaDiv = studentPage.getByTestId(`idea-${idea.name}`);
    await StudentIdeaDiv.getByTestId(TEST_IDS.IDEA_MORE_MENU).click();

    await expect(StudentIdeaDiv.getByTestId(TEST_IDS.REPORT_BUTTON)).toBeVisible();
    await expect(StudentIdeaDiv.getByTestId(TEST_IDS.EDIT_BUTTON)).toHaveCount(0);
    await expect(StudentIdeaDiv.getByTestId(TEST_IDS.DELETE_BUTTON)).toHaveCount(0);
  });
});

/**
 * Page States Tests
 * Empty state, heading count with singular/plural label, and the add FAB.
 * The FAB-hidden case (guest, role 10) is not coverable — all seeded users have role 20.
 */
test('Ideas page states', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const idea1 = entities.createIdea('states.1');
  const idea2 = entities.createIdea('states.2');

  const Heading = userPage.locator('h1');
  const EmptyState = userPage.getByTestId('ideas-empty-state');

  let singularHeading = '';

  await test.step('User - Empty room shows the empty state, a zero count and the add FAB', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);

    await expect(EmptyState).toBeVisible();
    await expect(Heading).toContainText('0');
    await expect(userPage.getByTestId(TEST_IDS.ADD_IDEA_BUTTON)).toBeVisible();
  });

  await test.step('User - First Idea replaces the empty state and counts in singular', async () => {
    await ideas.create(userPage, idea1);

    await expect(EmptyState).toBeHidden();
    await expect(Heading).toContainText('1');
    singularHeading = (await Heading.textContent()) ?? '';
  });

  await test.step('User - Second Idea switches the heading to plural', async () => {
    await ideas.create(userPage, idea2);

    await expect(Heading).toContainText('2');
    const pluralHeading = (await Heading.textContent()) ?? '';
    // the label must change between one and many, whatever the locale
    expect(pluralHeading.replace(/\d+/, '#')).not.toEqual(singularHeading.replace(/\d+/, '#'));
  });
});

/**
 * Edit Flow Tests
 * Pre-filled edit form; owners and admins can change title and content.
 */
test('Idea edit flow', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const adminPage = await newPageFor('admin');
  const idea = entities.createIdea('edit-flow');
  const titleEditedByUser = `${idea.name}.edited`;
  const contentEditedByUser = 'updated by owner during testing';
  const titleEditedByAdmin = `${idea.name}.admin-edited`;

  const openEditForm = async (page: import('@playwright/test').Page, ideaName: string) => {
    const IdeaDiv = page.getByTestId(`idea-${ideaName}`);
    await expect(IdeaDiv).toBeVisible();
    // so that any triggered tooltips dissappear
    await page.mouse.move(0, 0);
    await formInteractions.openMoreOption(page, IdeaDiv);
    await IdeaDiv.getByTestId(TEST_IDS.EDIT_BUTTON).click();
    await expect(page.getByTestId('idea-form')).toBeVisible();
  };

  await test.step('User - Create an Idea to edit', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);
  });

  await test.step('User - Edit form opens pre-filled with the idea values', async () => {
    await openEditForm(userPage, idea.name);

    await expect(userPage.getByTestId('idea-form-title')).toHaveValue(idea.name);
    await expect(userPage.getByTestId('idea-form-content')).toContainText(idea.description);
  });

  await test.step('User - Can change title and content of own Idea', async () => {
    await userPage.getByTestId('idea-form-title').fill(titleEditedByUser);
    await userPage.getByTestId('idea-form-content').locator('[contenteditable="true"]').fill(contentEditedByUser);
    await formInteractions.clickButton(userPage, 'idea-form-submit');
    await expect(userPage.getByTestId('idea-form')).toBeHidden();

    const IdeaDiv = userPage.getByTestId(`idea-${titleEditedByUser}`);
    await expect(IdeaDiv).toBeVisible();
    await expect(IdeaDiv).toContainText(contentEditedByUser);
  });

  await test.step("Admin - Can edit the User's Idea", async () => {
    await navigation.goToRoom(adminPage, seededRoom.name);
    await openEditForm(adminPage, titleEditedByUser);

    await adminPage.getByTestId('idea-form-title').fill(titleEditedByAdmin);
    await formInteractions.clickButton(adminPage, 'idea-form-submit');
    await expect(adminPage.getByTestId('idea-form')).toBeHidden();

    await expect(adminPage.getByTestId(`idea-${titleEditedByAdmin}`)).toBeVisible();
  });
});

/**
 * Like Flow Tests
 * Like/unlike toggling, server persistence, and other users' view of the count.
 */
test('Idea like flow', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');
  const idea = entities.createIdea('like-flow');

  const StudentLike = studentPage.getByTestId(`idea-${idea.name}`).getByTestId(TEST_IDS.LIKE_BUTTON);

  await test.step('User - Create an Idea to like', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);
  });

  await test.step("Student - Likes the User's Idea", async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);

    await expect(StudentLike).toHaveAttribute('aria-pressed', 'false');
    await expect(StudentLike).toContainText('0');

    await StudentLike.click();

    await expect(StudentLike).toHaveAttribute('aria-pressed', 'true');
    await expect(StudentLike).toContainText('1');
  });

  await test.step('Student - Like persists after a reload', async () => {
    await studentPage.reload();

    await expect(StudentLike).toHaveAttribute('aria-pressed', 'true');
    await expect(StudentLike).toContainText('1');
  });

  await test.step("User - Sees the count but not the Student's pressed state", async () => {
    await navigation.goToRoom(userPage, seededRoom.name);

    const UserLike = userPage.getByTestId(`idea-${idea.name}`).getByTestId(TEST_IDS.LIKE_BUTTON);
    await expect(UserLike).toContainText('1');
    await expect(UserLike).toHaveAttribute('aria-pressed', 'false');
  });

  await test.step('Student - Unlike reverts the count', async () => {
    await StudentLike.click();

    await expect(StudentLike).toHaveAttribute('aria-pressed', 'false');
    await expect(StudentLike).toContainText('0');
  });
});

/**
 * Draft Persistence Tests
 * The idea form drafts to sessionStorage; dismissal and reloads keep the
 * content, cancel discards it.
 */
test('Idea draft persistence', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const draft = entities.createIdea('draft');

  const openIdeaForm = async () => {
    await formInteractions.clickButton(userPage, TEST_IDS.ADD_IDEA_BUTTON);
    await expect(userPage.getByTestId('idea-form')).toBeVisible();
  };

  // backdrop click dismisses without the cancel button's explicit discard
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
