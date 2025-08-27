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

test.describe('Admin announcements', () => {
  test.beforeAll(async () => {
    fixtures.init();
  });
  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  //
  test('OFF - Admin can change make an announcement, sees own announcement', async () => {
    /* const admin = await browsers.newPage(browsers.admins_browser);

    const host = shared.getHost();

    await admin.goto(host);

    // navigate to the announcements page:
    await admin.locator('a[href="/settings/announcements"]').click({ timeout: 1000 });

    const NewButton = admin.locator('[data-testid="add-announcements-button"]');
    await expect(NewButton).toBeVisible();
    await NewButton.click({ timeout: 1000 });

    await admin.locator('input[name="headline"]').fill('Testing content');
    await admin.locator('div[contenteditable="true"]').fill('some data');

    const Selector = admin.locator('input[name="user_needs_to_consent"]').locator('..');
    await expect(Selector).toBeVisible();
    await Selector.click({ timeout: 1000 });
    await admin.locator('li[data-value="obligatory"]').click({ timeout: 1000 });
    // submit the idea form
    await admin.locator('button[type="submit"]').click({ timeout: 1000 });
    await expect(1).toBeDefined();

    await sleep(1);

    await admin.reload();
    await sleep(1);

    const ModalDiv = admin.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible();

    const ApproveButton = ModalDiv.getByRole('button', { name: 'Zustimmen' }).first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click({ timeout: 1000 });

    admin.close(); */
  });

  test('OFF - Alice also sees the announcement', async () => {
    /*   const alice = await browsers.newPage(browsers.alices_browser);
    const admin = await browsers.newPage(browsers.admins_browser);

    const host = shared.getHost();

    await alice.goto(host);

    await alice.reload();
    await alice.reload();

    await sleep(1);

    // alice shouldn't be able to navigate
    await expect(async () => {
      await users.goToProfile(alice);
    }).rejects.toThrow();

    const ModalDiv = alice.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible();

    const ApproveButton = ModalDiv.getByRole('button', { name: 'Zustimmen' }).first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click({ timeout: 1000 });

    // now she can
    await users.goToProfile(alice);

    // admin deletes all announcements

    await admin.goto(host);

    // admin also has to click away the announcement

    // admin deletes all announcements
    await admin.locator('a[href="/settings/announcements"]').click({ timeout: 1000 });
    await admin.locator('input[type="checkbox"]').first().click({ timeout: 1000 });
    const DeleteButton = admin.locator('[data-testid="remove-announcements-button"]');
    await expect(DeleteButton).toBeVisible();
    await DeleteButton.click({ timeout: 1000 });

    const Dialog = admin.getByRole('dialog');
    await expect(Dialog).toBeVisible();

    const ConfirmButton = Dialog.locator('button[color="error"]');
    await expect(ConfirmButton).toBeVisible();
    await ConfirmButton.click({ timeout: 1000 });

    alice.close();
    admin.close(); */
  });
});
