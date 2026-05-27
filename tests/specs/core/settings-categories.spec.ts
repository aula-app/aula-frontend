import { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as formInteractions from '../../interactions/forms';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as rooms from '../../interactions/rooms';
import * as settingsInteractions from '../../interactions/settings';
import * as shared from '../../support/utils';

/**
 * Category Management Tests
 * Tests category creation, assignment to ideas, and deletion
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Create category → Assign to idea → Remove from idea → Delete category
 */
test('Category management', async ({ seededRoom, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');
  const idea = entities.createIdea('category-tests', { category: shared.gensym('Test Category ') });

  await test.step('Admin should be able to create a new category', async () => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-idea');
    await formInteractions.clickButton(adminPage, 'add-new-category-chip');

    // Fill out Category creation form
    await formInteractions.fillForm(adminPage, 'category-name', idea.category!);
    const iconFieldContainer = adminPage.getByTestId('icon-field-container');
    await expect(iconFieldContainer).toBeVisible();
    const firstIconButton = iconFieldContainer.getByTestId('icon-cat-1');
    await expect(firstIconButton).toBeVisible();
    await firstIconButton.click();
    await formInteractions.clickButton(adminPage, 'category-form-submit-button');

    // Verify Category created
    const newCategorySelector = `category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`;
    const categoryChip = adminPage.getByTestId(newCategorySelector);
    await expect(categoryChip).toBeVisible();
  });

  await test.step('User can create Idea with a Category', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);

    const IdeaCategory = userPage.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).toBeVisible();
  });

  await test.step('Student can see the Idea with the Category', async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);

    const IdeaCategory = studentPage.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).toBeVisible();
  });

  await test.step('Admin can remove category from the Idea', async () => {
    await navigation.goToIdeasSettings(adminPage);
    await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'title', value: idea.name } });

    // Clear category from idea
    await formInteractions.clickButton(adminPage, 'category-field-clear-button');
    await formInteractions.clickButton(adminPage, 'submit-idea-form');
    await adminPage.waitForSelector('[data-testid="add-idea-form"]', { state: 'hidden' });
  });

  await test.step('User can verify category is removed', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    const IdeaCategory = adminPage.locator('div').filter({ hasText: idea.category });
    await expect(IdeaCategory).not.toBeVisible();
  });

  await test.step('Admin can add a Category to an existing Idea', async () => {
    await navigation.goToIdeasSettings(adminPage);
    await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'title', value: idea.name } });

    // open the category selector
    const CategorySelector = adminPage.getByTestId('category-field-text-input');
    await expect(CategorySelector).toBeVisible();
    await CategorySelector.click();

    // pick a category for the idea
    await adminPage.getByRole('option', { name: idea.category }).first().click();

    // submit the update of idea
    await formInteractions.clickButton(adminPage, 'submit-idea-form');
    await adminPage.waitForSelector('[data-testid="add-idea-form"]', { state: 'hidden' });
  });

  await test.step('Student can see the Idea with the Category', async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);

    const IdeaCategory = studentPage.locator('div').filter({ hasText: idea.category }).first();
    await expect(IdeaCategory).toBeVisible();
  });

  await test.step('Admin can delete a category', async () => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-idea');

    const CategoryChip = adminPage.getByTestId(`category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(CategoryChip).toBeVisible();
    const DeleteButton = CategoryChip.getByTestId('CancelIcon').first();
    await DeleteButton.click();

    await formInteractions.clickButton(adminPage, 'delete-cat-button');
    await expect(CategoryChip).not.toBeVisible();
  });

  await test.step('Student can verify the Category is removed from the Idea', async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);
    const IdeaCategory = adminPage.locator('div').filter({ hasText: idea.category });
    await expect(IdeaCategory).not.toBeVisible();
  });
});
