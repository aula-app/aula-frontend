import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
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
test.describe.serial('Category management', () => {
  let room = entities.createRoom('category-tests');
  let idea = entities.createIdea('category-tests', { category: shared.gensym('Test Category ') });

  test.beforeAll(async ({ userConfig, studentConfig }) => {
    room.users = [userConfig, studentConfig];
  });

  const removeCategory = async (adminPage: Page) => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-idea');

    const CategoryChip = adminPage.getByTestId(`category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(CategoryChip).toBeVisible();
    const DeleteButton = await CategoryChip.getByTestId('CancelIcon').first();
    await DeleteButton.click();

    await formInteractions.clickButton(adminPage, 'delete-cat-button');
    await adminPage.waitForTimeout(2000); // wait for the form to process

    await expect(CategoryChip).not.toBeVisible();
  };

  test('Admins should be able to create a new category', async ({ adminPage }) => {
    await test.step('Navigate to category settings', async () => {
      await navigation.goToSettings(adminPage);
      await navigation.openAccordion(adminPage, 'config-accordion-idea');
      await formInteractions.clickButton(adminPage, 'add-new-category-chip');
    });

    await test.step('Create new category', async () => {
      await formInteractions.fillForm(adminPage, 'category-name', idea.category ? idea.category : '');

      // Select category icon
      const iconFieldContainer = adminPage.getByTestId('icon-field-container');
      await expect(iconFieldContainer).toBeVisible();

      const firstIconButton = iconFieldContainer.getByTestId('icon-cat-1');
      await expect(firstIconButton).toBeVisible();
      await firstIconButton.click();
      await formInteractions.clickButton(adminPage, 'category-form-submit-button');
      await adminPage.waitForTimeout(2000); // wait for the form to process
    });

    await test.step('Verify category was created', async () => {
      const newCategorySelector = `category-chip-${idea.category?.toLowerCase().replace(/\s+/g, '-')}`;
      const categoryChip = adminPage.getByTestId(newCategorySelector);
      await expect(categoryChip).toBeVisible();
    });
  });

  test('Admin can add category to idea', async ({ adminPage }) => {
    await test.step('Create room with category', async () => {
      await rooms.create(adminPage, room);
    });

    await test.step('Create idea with category', async () => {
      await navigation.goToRoom(adminPage, room.name);
      await ideas.create(adminPage, idea);
    });

    await test.step('Verify category appears on idea', async () => {
      await navigation.goToRoom(adminPage, room.name);
      const IdeaCategory = adminPage.locator('div').filter({ hasText: idea.category }).first();
      await expect(IdeaCategory).toBeVisible();
    });
  });

  test('Admin can remove category from idea', async ({ adminPage }) => {
    await test.step('Navigate to idea settings', async () => {
      await navigation.goToIdeasSettings(adminPage);
      await settingsInteractions.openEdit({ page: adminPage, filters: { option: 'title', value: idea.name } });
    });

    await test.step('Clear category from idea', async () => {
      await formInteractions.clickButton(adminPage, 'category-field-clear-button');
      await adminPage.waitForTimeout(1000); // wait for the form to process

      await formInteractions.clickButton(adminPage, 'submit-idea-form');
      await adminPage.waitForTimeout(1000); // wait for the form to process
    });

    await test.step('Verify category is removed', async () => {
      await navigation.goToRoom(adminPage, room.name);
      const IdeaCategory = adminPage.locator('div').filter({ hasText: idea.category });
      await expect(IdeaCategory).not.toBeVisible();
    });
  });

  test('Admin can delete a category', async ({ adminPage }) => {
    await test.step('Delete category', async () => {
      await removeCategory(adminPage);
    });
  });
});
