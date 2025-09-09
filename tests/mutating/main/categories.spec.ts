import { expect, test } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as ideas from '../../shared/page_interactions/ideas';
import * as rooms from '../../shared/page_interactions/rooms';
import * as users from '../../shared/page_interactions/users';
import * as shared from '../../shared/shared';
import * as fixtures from '../../fixtures/users';

describeWithSetup('Categories flow', () => {
  let room: any;
  let data: { [k: string]: any } = {};

  test.beforeAll(async () => {
    room = TestDataBuilder.createRoom('categories');
  });

  //
  test('Admin can create a category and add it to an idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');
    const host = shared.getHost();

    await admin.goto(host);

    data.categoryName = 'TESTING' + shared.gensym();

    await users.goToSettings(admin);

    // Wait for the settings page to load completely
    await admin.waitForLoadState('networkidle');

    // open ideas accordion - it's an accordion summary, not a button
    const IdeeAccordeon = admin.getByTestId('config-accordion-idea');
    await expect(IdeeAccordeon).toBeVisible({ timeout: 10000 });
    await IdeeAccordeon.click();

    // Wait for ideas section to expand
    await admin.waitForTimeout(1000);

    // add category button - look for the add button in German
    const AddCategoryButton = admin.getByTestId('add-new-category-chip');
    await expect(AddCategoryButton).toBeVisible({ timeout: 10000 });
    await AddCategoryButton.click();

    // Wait for drawer/form to appear
    await admin.waitForTimeout(1000);

    // Look for the form specifically
    const Form = admin.getByTestId('category-forms');
    await expect(Form).toBeVisible({ timeout: 10000 });

    const CategoryNameField = admin.locator('input[name="name"]');
    await expect(CategoryNameField).toBeVisible({ timeout: 10000 });
    await CategoryNameField.fill(data.categoryName);

    // Select an icon - try different selectors
    const Icon = admin.getByTestId('icon-field-1');
    await expect(Icon).toBeVisible({ timeout: 10000 });
    await Icon.click();

    // Confirm button - target the submit button within the category form
    const SubmitButton = admin.locator('[data-testid="category-forms"] button[type="submit"]');
    await expect(SubmitButton).toBeVisible({ timeout: 10000 });
    await SubmitButton.click();

    // Wait for form to close and category to appear
    await admin.waitForTimeout(2000);

    // Look for the new category pill/chip
    const NewCategoryPill = admin.getByTestId(`category-chip-${data.categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(NewCategoryPill).toBeVisible({ timeout: 10000 });

    await expect(1).toBeDefined();

    // Create test idea with the new category
    data.catidea = TestDataBuilder.createIdea('with-category');
    data.catidea.category = data.categoryName;

    // Create test room for the idea
    data.room = TestDataBuilder.createRoom('category-test', [fixtures.alice, fixtures.bob]);

    await rooms.create(admin, data.room);

    await ideas.create(admin, data.room, data.catidea);

    await ideas.goToRoom(admin, data.room);

    // Look for the category within the specific idea card using a more specific selector
    const IdeaDiv = admin.getByTestId(`idea-${data.catidea.name}`);
    await expect(IdeaDiv).toBeVisible();

    // Use more specific selector for category - look for category chip or badge
    const IdeaCategory = IdeaDiv.getByTestId(`category-${data.categoryName}`)
      .or(IdeaDiv.locator('[data-testid*="category"]').filter({ hasText: data.categoryName }))
      .or(IdeaDiv.locator('.MuiChip-root').filter({ hasText: data.categoryName }))
      .first();
    await expect(IdeaCategory).toBeVisible();

    await BrowserHelpers.closePage(admin);
  });

  //
  test('Admin can delete a category', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');
    const host = shared.getHost();

    await admin.goto(host || 'http://localhost:3000');

    await users.goToSettings(admin);

    // Wait for the settings page to load completely
    await admin.waitForLoadState('networkidle');

    // open ideas accordion - it's an accordion summary, not a button
    const IdeeAccordeon = admin.getByTestId('config-accordion-idea');
    await expect(IdeeAccordeon).toBeVisible({ timeout: 10000 });
    await IdeeAccordeon.click();

    // Wait for accordion to expand
    await admin.waitForTimeout(1000);

    // Look for the category pill/chip
    const categoryName = data.categoryName!; // We know it exists from the first test
    const NewCategoryPill = admin.getByTestId(`category-chip-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(NewCategoryPill).toBeVisible({ timeout: 10000 });

    // Look for the remove/delete button on the chip
    const RemoveButton = NewCategoryPill.getByTestId('CancelIcon')
      .or(NewCategoryPill.locator('svg[data-testid*="Cancel"]'))
      .or(NewCategoryPill.locator('.MuiChip-deleteIcon'));
    await expect(RemoveButton).toBeVisible({ timeout: 10000 });
    await RemoveButton.click();

    // Wait for confirmation dialog
    const Dialog = admin.getByRole('dialog');
    await expect(Dialog).toBeVisible({ timeout: 10000 });

    // Look for delete confirmation button
    const ConfirmButton = Dialog.getByTestId('delete-cat-button');
    await expect(ConfirmButton).toBeVisible({ timeout: 10000 });
    await ConfirmButton.click();

    // Verify category was deleted - it should no longer be visible
    await expect(NewCategoryPill).not.toBeVisible();

    // Clean up test data
    await ideas.remove(admin, data.room, data.catidea);

    await BrowserHelpers.closePage(admin);
  });
});
