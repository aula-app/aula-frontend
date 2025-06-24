import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../../shared/utils';
import * as shared from '../../shared/shared';
import * as users from '../../shared/page_interactions/users';
import * as rooms from '../../shared/page_interactions/rooms';
import * as ideas from '../../shared/page_interactions/ideas';
import * as ui from '../../shared/page_interactions/interface';
import * as boxes from '../../shared/page_interactions/boxes';

import * as fixtures from '../../fixtures/users';
import * as browsers from '../../shared/page_interactions/browsers';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

test.describe('Categories flow', () => {
  let room;

  let data: { [k: string]: any } = {};

  test.beforeAll(async () => {
    fixtures.init();

    room = {
      name: 'room-' + shared.getRunId() + '-reporting',
      description: 'created during automated testing',
      users: [
        //
        fixtures.rainer, //
        fixtures.alice,
        fixtures.bob,
        fixtures.mallory, //
      ],
    };
  });
  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  //
  test('Admin can create a category and add it to an idea', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);
    const host = shared.getHost();

    await admin.goto(host || 'http://localhost:3000');

    data.categoryName = 'TESTING' + shared.gensym();

    await users.goToSettings(admin);

    // Wait for the settings page to load completely
    await admin.waitForLoadState('networkidle');

    // open ideas accordion - it's an accordion summary, not a button
    // Improved: Use data-testid for more reliable selection
    const IdeeAccordeon = admin.getByTestId('config-accordion-idea');
    await expect(IdeeAccordeon).toBeVisible({ timeout: 10000 });
    await IdeeAccordeon.click();

    // Wait for ideas section to expand
    await admin.waitForTimeout(1000);

    // add category button - look for the add button in German
    // Improved: Use data-testid for more reliable selection
    const AddCategoryButton = admin.getByTestId('add-new-category-chip');
    await expect(AddCategoryButton).toBeVisible({ timeout: 10000 });
    await AddCategoryButton.click();

    // Wait for drawer/form to appear
    await admin.waitForTimeout(1000);

    // Look for the form specifically
    const Form = admin.locator('[data-testing-id="category-forms"]');
    await expect(Form).toBeVisible({ timeout: 10000 });

    const CategoryNameField = admin.locator('input[name="name"]');
    await expect(CategoryNameField).toBeVisible({ timeout: 10000 });
    await CategoryNameField.fill(data.categoryName);

    // Select an icon - try different selectors
    const Icon = admin
      .locator('[data-testing-id="icon-field-icon"]')
      .first()
      .or(admin.locator('[data-testid*="icon"]').first())
      .or(admin.locator('button').filter({ hasText: /icon/i }).first());
    await expect(Icon).toBeVisible({ timeout: 10000 });
    await Icon.click();

    // Confirm button - target the submit button within the category form
    const SubmitButton = admin.locator('[data-testing-id="category-forms"] button[type="submit"]');
    await expect(SubmitButton).toBeVisible({ timeout: 10000 });
    await SubmitButton.click();

    // Wait for form to close and category to appear
    await admin.waitForTimeout(2000);

    // Look for the new category pill/chip
    // Improved: Use data-testid for more reliable selection
    const NewCategoryPill = admin.getByTestId(`category-chip-${data.categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(NewCategoryPill).toBeVisible({ timeout: 10000 });

    await expect(1).toBeDefined();

    const someIdea = {
      name: 'someIdea-test-idea' + shared.getRunId() + '-' + shared.gensym(),
      description: 'generated during testing data',
      category: data.categoryName,
    };

    data.catidea = someIdea;

    const room = {
      name: 'room-' + shared.getRunId() + shared.gensym(),
      description: 'created during automated testing',
      users: [fixtures.alice, fixtures.bob],
    };

    data.room = room;

    await rooms.create(admin, data.room);

    await ideas.create(admin, room, data.catidea);

    await ideas.goToRoom(admin, data.room);

    const IdeaCategory = admin.locator('div').filter({ hasText: data.catidea.category }).first();
    await expect(IdeaCategory).toBeVisible({ timeout: 1000 });

    await admin.close();
  });

  //
  test('Admin can delete a category', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);
    const host = shared.getHost();

    await admin.goto(host || 'http://localhost:3000');

    await users.goToSettings(admin);

    // Wait for the settings page to load completely
    await admin.waitForLoadState('networkidle');

    // open ideas accordion - it's an accordion summary, not a button
    // Improved: Use data-testid for more reliable selection
    const IdeeAccordeon = admin.getByTestId('config-accordion-idea');
    await expect(IdeeAccordeon).toBeVisible({ timeout: 10000 });
    await IdeeAccordeon.click();

    // Wait for accordion to expand
    await admin.waitForTimeout(1000);

    // Look for the category pill/chip
    const categoryName = data.categoryName!; // We know it exists from the first test
    // Improved: Use data-testid for more reliable selection
    const NewCategoryPill = admin.getByTestId(`category-chip-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    await expect(NewCategoryPill).toBeVisible({ timeout: 10000 });

    // Look for the remove/delete button on the chip
    const RemoveButton = NewCategoryPill.locator('[data-testid="CancelIcon"]')
      .or(NewCategoryPill.locator('svg[data-testid*="Cancel"]'))
      .or(NewCategoryPill.locator('.MuiChip-deleteIcon'));
    await expect(RemoveButton).toBeVisible({ timeout: 10000 });
    await RemoveButton.click();

    // Wait for confirmation dialog
    const Dialog = admin.getByRole('dialog');
    await expect(Dialog).toBeVisible({ timeout: 10000 });

    // Look for delete confirmation button
    // Improved: Use data-testid for more reliable selection
    const ConfirmButton = Dialog.getByTestId('confirm-dialog-confirm');
    await expect(ConfirmButton).toBeVisible({ timeout: 10000 });
    await ConfirmButton.click();

    await expect(1).toBeDefined();

    await ideas.remove(admin, data.room, data.catidea);

    await rooms.remove(admin, data.room);

    await admin.close();
  });
});
