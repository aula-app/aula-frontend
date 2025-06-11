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

  /*   //
  test('Admin can change make an announcement, sees own announcement', async () => {
    const admin = await browsers.newPage(browsers.admins_browser);

    const host = shared.getHost();

    await admin.goto(host);

    // navigate to the announcements page:
    await admin.locator('a[href="/settings/announcements"]').click({timeout: 1000});

    const NewButton = admin.getByRole('button', { name: 'Neue ankündigung' });
    await expect(NewButton).toBeVisible({ timeout: 1000 });
    await NewButton.click({timeout: 1000});

    await admin.locator('input[name="headline"]').fill('Testing content', { timeout: 1000 });
    await admin.locator('div[contenteditable="true"]').fill('some data');

    const Selector = admin.locator('input[name="user_needs_to_consent"]').locator('..');
    await expect(Selector).toBeVisible({ timeout: 1000 });
    await Selector.click({ timeout: 1000 });
    await admin.getByRole('option', { name: 'Obligatorische Zustimmung' }).click({timeout: 1000});
    // submit the idea form
    await admin.locator('button[type="submit"]').click({timeout: 1000});
    await expect(1).toBeDefined();

    await sleep(1);

    await admin.reload();
    await sleep(1);

    const ModalDiv = admin.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible({ timeout: 1000 });

    const ApproveButton = ModalDiv.getByRole('button', { name: 'Zustimmen' }).first();
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click({timeout: 1000});

    admin.close();
  });

  test('Alice also sees the announcement', async () => {
    const alice = await browsers.newPage(browsers.alices_browser);

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
    await expect(ModalDiv).toBeVisible({ timeout: 1000 });

    const ApproveButton = ModalDiv.getByRole('button', { name: 'Zustimmen' }).first();
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click({timeout: 1000});

    // now she can
    await users.goToProfile(alice);

    alice.close();
  }); */
});
