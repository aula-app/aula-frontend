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

test.describe('Change pass flow', () => {
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
  test('Alice can change her password', async () => {
    const alice = await browsers.newPage(browsers.alices_browser);

    const host = shared.getHost();

    await alice.goto(host);

    await users.goToProfile(alice);

    // open sicherheit accordeon
    const SicherheitAccordeon = alice.getByRole('button', { name: 'Sicherheit' });
    await expect(SicherheitAccordeon).toBeVisible({ timeout: 1000 });
    await SicherheitAccordeon.click({ timeout: 1000 });

    await alice.fill('input[name="oldPassword"]', fixtures.alice.password);
    await alice.fill('input[name="newPassword"]', 'TEMPPASS!!!');
    await alice.fill('input[name="confirmPassword"]', 'TEMPPASS!!!');

    const SubmitButton = alice.locator('[data-testing-id="submit-new-password"]');
    await SubmitButton.click();

    const SuccessDiv = alice.locator('div').filter({ hasText: `Passwort erfolgreich geändert` }).first();
    await expect(SuccessDiv).toBeVisible({ timeout: 1000 });

    alice.close();
  });

  test('Alice can change her password back', async () => {
    const alice = await browsers.newPage(browsers.alices_browser);

    const host = shared.getHost();

    await alice.goto(host);

    await users.goToProfile(alice);

    // open sicherheit accordeon
    const SicherheitAccordeon = alice.getByRole('button', { name: 'Sicherheit' });
    await expect(SicherheitAccordeon).toBeVisible({ timeout: 1000 });
    await SicherheitAccordeon.click({ timeout: 1000 });

    await alice.fill('input[name="oldPassword"]', 'TEMPPASS!!!');
    await alice.fill('input[name="newPassword"]', fixtures.alice.password);
    await alice.fill('input[name="confirmPassword"]', fixtures.alice.password);

    const SubmitButton = alice.locator('[data-testing-id="submit-new-password"]');
    await SubmitButton.click();

    const SuccessDiv = alice.locator('div').filter({ hasText: `Passwort erfolgreich geändert` }).first();
    await expect(SuccessDiv).toBeVisible({ timeout: 1000 });

    alice.close();
  });
});
