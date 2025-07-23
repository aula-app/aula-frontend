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
    await expect(SicherheitAccordeon).toBeVisible();
    await SicherheitAccordeon.click({ timeout: 1000 });

    await alice.fill('input[name="oldPassword"]', fixtures.alice.password);
    await alice.fill('input[name="newPassword"]', 'TEMPPASS!!!');
    await alice.fill('input[name="confirmPassword"]', 'TEMPPASS!!!');

    const SubmitButton = alice.getByTestId('submit-new-password');
    await SubmitButton.click({ timeout: 1000 });

    const SuccessDiv = alice.locator('div').filter({ hasText: `Passwort erfolgreich geändert` }).first();
    await expect(SuccessDiv).toBeVisible();

    alice.close();
  });

  test('Alice can change her password back', async () => {
    const alice = await browsers.newPage(browsers.alices_browser);

    const host = shared.getHost();

    await alice.goto(host);

    await users.goToProfile(alice);

    // open sicherheit accordeon
    const SicherheitAccordeon = alice.getByRole('button', { name: 'Sicherheit' });
    await expect(SicherheitAccordeon).toBeVisible();
    await SicherheitAccordeon.click({ timeout: 1000 });

    await alice.fill('input[name="oldPassword"]', 'TEMPPASS!!!');
    await alice.fill('input[name="newPassword"]', fixtures.alice.password);
    await alice.fill('input[name="confirmPassword"]', fixtures.alice.password);

    const SubmitButton = alice.getByTestId('submit-new-password');
    await SubmitButton.click({ timeout: 1000 });

    const SuccessDiv = alice.locator('div').filter({ hasText: `Passwort erfolgreich geändert` }).first();
    await expect(SuccessDiv).toBeVisible();

    alice.close();
  });
});
