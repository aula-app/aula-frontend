import { expect, test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as formInteractions from '../../shared/interactions/forms';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import * as rooms from '../../shared/interactions/rooms';
import * as settingsInteractions from '../../shared/interactions/settings';
import * as shared from '../../shared/shared';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

describeWithSetup('Category management', () => {
  let admin: any;
  let room = entities.createRoom('category-tests');
  let idea = entities.createIdea('category-tests', { category: shared.gensym('Test Category ') });

  test.beforeAll(async () => {
    admin = await browsers.getUserBrowser('admin');

    const user1Data = await userData.use('user');
    const user2Data = await userData.use('student');

    room.users = [user1Data, user2Data];
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

  const cleanupQueue = {
    category: false,
    room: false,
    idea: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.idea) {
      cleanupQueue.idea = false;
      await ideas.remove(admin, room, idea);
    }
    if (cleanupQueue.room) {
      cleanupQueue.room = false;
      await rooms.remove(admin, room);
    }
    if (cleanupQueue.category) {
      cleanupQueue.category = false;
      await removeCategory();
    }
  };

  test('Admins should be able to create a new category', async () => {
    navigation.goToSettings(admin);
    navigation.openAccordion(admin, 'config-accordion-idea');
    formInteractions.clickButton(admin, 'add-new-category-chip');

    formInteractions.fillForm(admin, 'category-name-field', idea.category ? idea.category : '');

    // Select category icon
    const iconFieldContainer = admin.getByTestId('icon-field-container');
    await expect(iconFieldContainer).toBeVisible();

    const firstIconButton = iconFieldContainer.getByTestId('icon-cat-1');
    await expect(firstIconButton).toBeVisible();
    await firstIconButton.click();
    formInteractions.clickButton(admin, 'category-form-submit-button');
    await admin.waitForTimeout(2000); // wait for the form to process

    // Verify that the new category appears in the list
    const newCategorySelector = `category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`;
    const categoryChip = admin.getByTestId(newCategorySelector);
    await expect(categoryChip).toBeVisible();

    cleanupQueue.category = true;
  });

  test('Admin can add category to idea', async () => {
    await rooms.create(admin, room);
    cleanupQueue.room = true;

    await navigation.goToRoom(admin, room.name);
    await ideas.create(admin, idea);
    cleanupQueue.idea = true;

    await navigation.goToRoom(admin, room.name);

    const IdeaCategory = admin.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).toBeVisible();
  });

  test('Admin can remove category from idea', async () => {
    await navigation.goToIdeasSettings(admin);
    await settingsInteractions.openEdit({ page: admin, filters: { option: 'title', value: idea.name } });

    formInteractions.clickButton(admin, 'category-field-clear-button');
    await admin.waitForTimeout(1000); // wait for the form to process

    formInteractions.clickButton(admin, 'submit-idea-form');
    await admin.waitForTimeout(1000); // wait for the form to process

    await navigation.goToRoom(admin, room.name);

    const IdeaCategory = admin.locator('div').filter({ hasText: idea.category });
    await expect(IdeaCategory).not.toBeVisible();
  });

  test('Admin can delete a category', async () => {
    cleanupQueue.category = false; // reset to false to ensure cleanup does not try to delete again
    await removeCategory();
  });

  const removeCategory = async () => {
    navigation.goToSettings(admin);
    navigation.openAccordion(admin, 'config-accordion-idea');

    const CategoryChip = admin.getByTestId(`category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(CategoryChip).toBeVisible();
    const DeleteButton = await CategoryChip.getByTestId('CancelIcon').first();
    await DeleteButton.click();

    formInteractions.clickButton(admin, 'delete-cat-button');
    await admin.waitForTimeout(2000); // wait for the form to process

    await expect(CategoryChip).not.toBeVisible();
  };

  test('Cleanup after tests', async () => {
    await cleanup();
  });
});
