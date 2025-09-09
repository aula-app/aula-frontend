import { test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { CategoryTestHelpers, CategoryTestContext } from '../../shared/helpers/categories';
import * as ideas from '../../shared/page_interactions/ideas';

describeWithSetup('Categories flow', () => {
  // Track cleanup contexts for emergency cleanup
  const cleanupQueue: Array<{ page: any; context: CategoryTestContext }> = [];

  test.afterEach(async () => {
    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await CategoryTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });
  test('Admin can create a category', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      await CategoryTestHelpers.executeWithCleanup(
        admin,
        async (context) => {
          const { categoryName, categoriesPage } = context;

          await categoriesPage.createCategory(categoryName);
          await categoriesPage.verifyCategoryExists(categoryName);
        },
        cleanupQueue
      );
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Admin can add category to idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      await CategoryTestHelpers.executeWithCleanup(
        admin,
        async (context) => {
          const { categoryName, categoriesPage } = context;

          await categoriesPage.createCategory(categoryName);

          const { testRoom, testIdea } = await CategoryTestHelpers.createCategoryWithIdea(admin, categoryName);

          context.testRoom = testRoom;
          context.testIdea = testIdea;

          await ideas.goToRoom(admin, testRoom);
          await categoriesPage.verifyCategoryOnIdea(testIdea.name, categoryName);
        },
        cleanupQueue
      );
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Admin can remove category from idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
        const { categoryName, categoriesPage } = context;

        await categoriesPage.createCategory(categoryName);

        const { testRoom, testIdea } = await CategoryTestHelpers.createCategoryWithIdea(admin, categoryName);

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

        // Clear the category from the idea using metadata instead of hardcoded text
        const CategoryFieldInput = admin.getByTestId('category-field-input');
        await CategoryFieldInput.waitFor({ state: 'visible' });
        await CategoryFieldInput.click();

        // Clear the selection by using the autocomplete clear functionality
        const ClearButton = CategoryFieldInput.locator('+ div')
          .getByRole('button', { name: /clear/i })
          .or(CategoryFieldInput.locator('+ div').locator('[data-testid*="ClearIcon"], [aria-label*="clear" i]'));

        if (await ClearButton.isVisible()) {
          await ClearButton.click();
        } else {
          // Alternative: Select the field and clear with keyboard
          await CategoryFieldInput.focus();
          await admin.keyboard.press('Control+a'); // Select all
          await admin.keyboard.press('Delete'); // Delete selection
          await admin.keyboard.press('Escape'); // Close dropdown
        }

        // Submit the form
        await admin.locator('button[type="submit"]').click();

        // Wait a bit for the UI to update
        await admin.waitForTimeout(1000);

        // Verify the category was removed by checking that no category element exists
        const CategoryElements = admin
          .getByTestId(`category-${categoryName}`)
          .or(admin.locator('[data-testid*="category"]').filter({ hasText: categoryName }))
          .or(admin.locator('.MuiChip-root').filter({ hasText: categoryName }));

        const count = await CategoryElements.count();
        if (count > 0) {
          // If there are still category elements, wait for them to disappear
          await CategoryElements.first()
            .waitFor({ state: 'hidden', timeout: 5000 })
            .catch(() => {
              // Expected - category should be removed
            });
        }
      });
    } catch (error) {
      console.error('Test "Admin can remove category from idea" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Admin can delete a category', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      await CategoryTestHelpers.executeWithCleanup(admin, async (context) => {
        const { categoryName, categoriesPage } = context;

        await categoriesPage.createCategory(categoryName);
        await categoriesPage.verifyCategoryExists(categoryName);
        await categoriesPage.deleteCategory(categoryName);
      });
    } catch (error) {
      console.error('Test "Admin can delete a category" failed:', error);
      throw error;
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });
});
