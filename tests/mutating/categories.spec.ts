import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as ideas from './page_interactions/ideas';
import * as ui from './page_interactions/interface';
import * as boxes from './page_interactions/boxes';

import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

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
  test('Admin can create a category', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);
    const host = shared.getHost();

    await admin.goto(host);

    // navigate to the setting page:
    const SettingsButton = admin.locator('a[href="/settings/configuration"]');
    await expect(SettingsButton).toBeVisible({ timeout: 1000 });
    await SettingsButton.click({ timeout: 1000 });

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
    await CategoryNameField.fill('TESTING CATEGORY');

    const Icon = admin.locator('[data-testing-id="icon-field-icon"]').first();
    await expect(Icon).toBeVisible({ timeout: 7000 });
    await Icon.click({ timeout: 5000 });

    const SubmitButton = Form.getByRole('button', { name: 'Bestätigen' });
    await expect(SubmitButton).toBeVisible({ timeout: 7000 });
    await SubmitButton.click();

    const NewCategoryPill = admin.getByRole('button', { name: 'TESTING CATEGORY' }).first();
    await expect(NewCategoryPill).toBeVisible({ timeout: 3000 });

    await expect(1).toBeDefined();

    await admin.close();
  });

  //
  test('Admin can delete a category', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);
    const host = shared.getHost();

    await admin.goto(host);

    // navigate to the setting page:
    const SettingsButton = admin.locator('a[href="/settings/configuration"]');
    await expect(SettingsButton).toBeVisible({ timeout: 1000 });
    await SettingsButton.click({ timeout: 1000 });

    // open ideas accordeon
    const IdeeAccordeon = admin.getByRole('button', { name: 'Idee' });
    await expect(IdeeAccordeon).toBeVisible({ timeout: 1000 });
    await IdeeAccordeon.click({ timeout: 1000 });

    const NewCategoryPill = admin.getByRole('button', { name: 'TESTING CATEGORY' }).first();
    await expect(NewCategoryPill).toBeVisible({ timeout: 3000 });

    const RemoveButton = NewCategoryPill.locator('[data-testid="CancelIcon"]');
    await expect(RemoveButton).toBeVisible({ timeout: 3000 });
    await RemoveButton.click();

    const Dialog = admin.getByRole('dialog');
    await expect(Dialog).toBeVisible({ timeout: 3000 });

    const ConfirmButton = Dialog.getByRole('button', { name: 'Löschen' });
    await expect(ConfirmButton).toBeVisible({ timeout: 3000 });
    await ConfirmButton.click();

    await expect(1).toBeDefined();

    await admin.close();
  });
});
