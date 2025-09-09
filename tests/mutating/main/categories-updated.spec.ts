/**
 * UPDATED VERSION: Categories test using new boilerplate organization
 * This shows the exact changes needed to use the new utilities
 */

import { expect, test } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';

// Only import the specific modules still needed for business logic
import * as ideas from '../../shared/page_interactions/ideas';
import * as rooms from '../../shared/page_interactions/rooms';
import * as users from '../../shared/page_interactions/users';
import * as shared from '../../shared/shared';

describeWithSetup('Categories flow', () => {
  let room: any;
  let data: { [k: string]: any } = {};

  test.beforeAll(async () => {
    // Using TestDataBuilder instead of manual creation
    room = TestDataBuilder.createRoom('categories');
  });

  test('Admin can create a category and add it to an idea', async () => {
    // Using BrowserHelpers instead of direct browser access
    const admin = await BrowserHelpers.openPageForUser('admin');
    
    await admin.goto(shared.getHost());

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

    // Using TestDataBuilder for idea creation
    const someIdea = TestDataBuilder.createIdea('category-test');

    await admin.goto(shared.getHost());
    await rooms.create(admin, room);

    await ideas.create(admin, room, someIdea);
    await ideas.addCategory(admin, room, someIdea, data.categoryName);

    // Cleanup using safe helper
    await ideas.remove(admin, room, someIdea);
    await BrowserHelpers.closePage(admin);
  });
});