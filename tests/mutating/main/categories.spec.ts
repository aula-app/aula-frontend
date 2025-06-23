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

    await admin.goto(host);

    data.categoryName = 'TESTING' + shared.gensym();

    await users.goToSettings(admin);

    // open ideas accordeon
    const IdeeAccordeon = admin.getByRole('button', { name: 'Idee' });
    await expect(IdeeAccordeon).toBeVisible({ timeout: 1000 });
    await IdeeAccordeon.click({ timeout: 1000 });

    // add category button
    const AddCategoryButton = admin.getByRole('button', { name: 'Neue kategorie' });
    await expect(AddCategoryButton).toBeVisible({ timeout: 6000 });
    await AddCategoryButton.click({ timeout: 6000 });

    const Form = admin.locator('[data-testing-id="category-forms"]');
    await expect(Form).toBeVisible({ timeout: 7000 });

    const CategoryNameField = admin.locator('input[name="name"]');
    await expect(CategoryNameField).toBeVisible({ timeout: 7000 });
    await CategoryNameField.fill(data.categoryName);

    const Icon = admin.locator('[data-testing-id="icon-field-icon"]').first();
    await expect(Icon).toBeVisible({ timeout: 7000 });
    await Icon.click({ timeout: 5000 });

    const SubmitButton = Form.getByRole('button', { name: 'Bestätigen' });
    await expect(SubmitButton).toBeVisible({ timeout: 7000 });
    await SubmitButton.click({ timeout: 1000 });

    const NewCategoryPill = admin.getByRole('button', { name: data.categoryName }).first();
    await expect(NewCategoryPill).toBeVisible({ timeout: 3000 });

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

    await admin.goto(host);

    await users.goToSettings(admin);

    // open ideas accordeon
    const IdeeAccordeon = admin.getByRole('button', { name: 'Idee' });
    await expect(IdeeAccordeon).toBeVisible({ timeout: 1000 });
    await IdeeAccordeon.click({ timeout: 1000 });

    const NewCategoryPill = admin.getByRole('button', { name: data.categoryName }).first();
    await expect(NewCategoryPill).toBeVisible({ timeout: 3000 });

    const RemoveButton = NewCategoryPill.locator('[data-testid="CancelIcon"]');
    await expect(RemoveButton).toBeVisible({ timeout: 3000 });
    await RemoveButton.click({ timeout: 1000 });

    const Dialog = admin.getByRole('dialog');
    await expect(Dialog).toBeVisible({ timeout: 3000 });

    const ConfirmButton = Dialog.getByRole('button', { name: 'Löschen' });
    await expect(ConfirmButton).toBeVisible({ timeout: 3000 });
    await ConfirmButton.click({ timeout: 1000 });

    await expect(1).toBeDefined();

    await ideas.remove(admin, data.room, data.catidea);

    await rooms.remove(admin, data.room);

    await admin.close();
  });
});
