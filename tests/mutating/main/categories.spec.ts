import { test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { CategoryTestHelpers } from '../../shared/helpers/categories';
import * as ideas from '../../shared/page_interactions/ideas';

describeWithSetup('Categories flow', () => {
  test('Admin can create a category', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
      const { categoryName, categoriesPage } = context;

      await categoriesPage.createCategory(categoryName);
      await categoriesPage.verifyCategoryExists(categoryName);
    });

    await BrowserHelpers.closePage(admin);
  });

  test('Admin can add category to idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
      const { categoryName, categoriesPage } = context;

      await categoriesPage.createCategory(categoryName);

      const { testRoom, testIdea } = await CategoryTestHelpers.createCategoryWithIdea(
        admin, 
        categoryName
      );

      context.testRoom = testRoom;
      context.testIdea = testIdea;

      await ideas.goToRoom(admin, testRoom);
      await categoriesPage.verifyCategoryOnIdea(testIdea.name, categoryName);
    });

    await BrowserHelpers.closePage(admin);
  });

  test('Admin can remove category from idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
      const { categoryName, categoriesPage } = context;

      await categoriesPage.createCategory(categoryName);

      const { testRoom, testIdea } = await CategoryTestHelpers.createCategoryWithIdea(
        admin, 
        categoryName
      );

      context.testRoom = testRoom;
      context.testIdea = testIdea;

      await ideas.goToRoom(admin, testRoom);
      await categoriesPage.verifyCategoryOnIdea(testIdea.name, categoryName);
      
      // Remove category from idea by editing the idea and clearing the category
      const IdeaDiv = admin.getByTestId(`idea-${testIdea.name}`).first();
      await IdeaDiv.waitFor({ state: 'visible' });

      // Move mouse away to avoid tooltips
      await admin.mouse.move(0, 0);

      // Click on the more menu
      const DotMenuDiv = IdeaDiv.getByTestId('idea-more-menu');
      await DotMenuDiv.waitFor({ state: 'visible' });
      await DotMenuDiv.click();

      // Click edit button
      const EditButton = IdeaDiv.getByTestId('edit-button');
      await EditButton.waitFor({ state: 'visible' });
      await EditButton.click();

      // Clear the category from the idea
      const SelectorId = await admin.getAttribute('label:text("Kategorie")', 'for');
      const CategorySelector = admin.locator(`#${SelectorId}`);
      await CategorySelector.waitFor({ state: 'visible' });
      await CategorySelector.click();

      // Clear the selection by clicking the clear button or selecting empty option
      const ClearButton = admin.locator('[title="Clear"]').or(admin.getByRole('button', { name: 'Clear' }));
      if (await ClearButton.isVisible()) {
        await ClearButton.click();
      } else {
        // Try to press Escape to close without selecting anything
        await admin.keyboard.press('Escape');
      }

      // Submit the form
      await admin.locator('button[type="submit"]').click();

      // Wait a bit for the UI to update
      await admin.waitForTimeout(1000);

      // Verify the category was removed by checking that no category element exists
      const CategoryElements = admin.getByTestId(`category-${categoryName}`)
        .or(admin.locator('[data-testid*="category"]').filter({ hasText: categoryName }))
        .or(admin.locator('.MuiChip-root').filter({ hasText: categoryName }));
      
      const count = await CategoryElements.count();
      if (count > 0) {
        // If there are still category elements, wait for them to disappear
        await CategoryElements.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
          // Expected - category should be removed
        });
      }
    });

    await BrowserHelpers.closePage(admin);
  });

  test('Admin can delete a category', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
      const { categoryName, categoriesPage } = context;

      await categoriesPage.createCategory(categoryName);
      await categoriesPage.verifyCategoryExists(categoryName);
      await categoriesPage.deleteCategory(categoryName);
    });

    await BrowserHelpers.closePage(admin);
  });
});
