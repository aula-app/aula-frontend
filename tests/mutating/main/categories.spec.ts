import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import * as rooms from '../../shared/interactions/rooms';
import * as settingsInteractions from '../../shared/interactions/settings';
import * as shared from '../../shared/shared';

const getUsers = () => {
  // Ensure users are initialized when accessed
  if (!userData.alice) userData.init();
  return [
    userData.testUsers.alice(),
    userData.testUsers.bob(),
    userData.testUsers.mallory(),
    userData.testUsers.rainer(),
  ];
};

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

describeWithSetup('Category management', () => {
  let admin: any;

  const room = {
    name: `room-${shared.getRunId()}-categories-tests`,
    description: 'created during automated testing for categories.spec.ts',
    users: getUsers(),
  };

  const idea = {
    name: '',
    description: 'Idea generated during category management tests',
    category: '',
  };

  const cleanupQueue = {
    category: false,
    room: false,
    idea: false,
  };

  test.beforeAll(async () => {
    admin = await browsers.newPage(browsers.admins_browser);

    idea.name = shared.gensym('Test idea ');
    idea.category = shared.gensym('Test Category ');
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  test.afterAll(async () => {
    await cleanup();
    await admin.close();
  });

  const cleanup = async () => {
    if (cleanupQueue.idea) await ideas.remove(admin, room, idea);
    cleanupQueue.idea = false;
    if (cleanupQueue.room) await rooms.remove(admin, room);
    cleanupQueue.room = false;
    if (cleanupQueue.category) await removeCategory();
    cleanupQueue.category = false;
  };

  test('Admins should be able to create a new category', async () => {
    navigation.goToSettings(admin);
    navigation.openAccordion(admin, 'config-accordion-idea');
    formInteractions.clickButton(admin, 'add-new-category-chip');

    formInteractions.fillForm(admin, 'category-name-field', idea.category);

    // Select category icon
    const iconFieldContainer = admin.getByTestId('icon-field-container');
    await expect(iconFieldContainer).toBeVisible();

    const firstIconButton = iconFieldContainer.getByTestId('icon-cat-1');
    await expect(firstIconButton).toBeVisible();
    await firstIconButton.click();
    formInteractions.clickButton(admin, 'category-form-submit-button');
    await admin.waitForTimeout(2000); // wait for the form to process

    // Verify that the new category appears in the list
    const newCategorySelector = `category-chip-${idea.category.toLowerCase().replace(/\s+/g, '-')}`;
    const categoryChip = admin.getByTestId(newCategorySelector);
    await expect(categoryChip).toBeVisible();

    cleanupQueue.category = true;
  });

  test('Admin can add category to idea', async () => {
    await rooms.create(admin, room);
    cleanupQueue.room = true;

    await ideas.create(admin, room, idea);
    cleanupQueue.idea = true;

    await rooms.goToRoom(admin, room.name);

    const IdeaCategory = admin.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).toBeVisible();
  });

  test('Admin can remove category from idea', async () => {
    await navigation.goToIdeasSettings(admin);
    await settingsInteractions.openEdit(admin, 'title', idea.name);

    const ClearButton = admin.getByTestId('category-field-clear-button');
    await expect(ClearButton).toBeVisible();
    await ClearButton.click();

    formInteractions.clickButton(admin, 'submit-idea-form');

    await rooms.goToRoom(admin, room.name);

    const IdeaCategory = admin.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).not.toBeVisible();
  });

  test('Admin can delete a category', async () => {
    cleanupQueue.category = false; // reset to false to ensure cleanup does not try to delete again
    await removeCategory();
  });

  const removeCategory = async () => {
    navigation.goToSettings(admin);
    navigation.openAccordion(admin, 'config-accordion-idea');

    const CategoryChip = admin.getByTestId(`category-chip-${idea.category.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(CategoryChip).toBeVisible();
    const DeleteButton = await CategoryChip.getByTestId('CancelIcon').first();
    await DeleteButton.click();

    formInteractions.clickButton(admin, 'delete-cat-button');
    await admin.waitForTimeout(2000); // wait for the form to process

    await expect(CategoryChip).not.toBeVisible();
  };

  test('Cleanup after tests', async () => {
    await cleanup(); // ensure cleanup is called and can be debugged if needed
  });
});
