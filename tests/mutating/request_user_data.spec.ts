import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';

import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

test.describe('Request user data flow', () => {
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
  test('Alice can request user data', async () => {
    const host = shared.getHost();

    const alice = await browsers.newPage(browsers.alices_browser);

    await alice.goto(host);

    // navigate to the user setting page:
    const ProfileButton = alice.locator('a[href="/settings/profile"]');
    await expect(ProfileButton).toBeVisible({ timeout: 1000 });
    await ProfileButton.click({ timeout: 1000 });

    // open datenschutz accordeon
    const DatenschutzAccordeon = alice.getByRole('button', { name: 'Datenschutz' });
    await expect(DatenschutzAccordeon).toBeVisible({ timeout: 1000 });
    await DatenschutzAccordeon.click({ timeout: 1000 });

    // press request data button
    const RequestDataButton = alice.getByRole('button', { name: 'Datenexport anfordern' });
    await expect(RequestDataButton).toBeVisible({ timeout: 1000 });
    await RequestDataButton.click({ timeout: 1000 });

    await alice.close();
  });

  //
  test('Admin can approve the request', async () => {
    const host = shared.getHost();

    const admin = await browsers.newPage(browsers.admins_browser);

    await admin.goto(host);

    // navigate to the anfragen page:
    const ProfileButton = admin.locator('a[href="/settings/requests"]');
    await expect(ProfileButton).toBeVisible({ timeout: 1000 });
    await ProfileButton.click({ timeout: 1000 });

    const AnfrageDiv = admin
      .locator('div')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible({ timeout: 1000 });

    const ApproveButton = AnfrageDiv.getByRole('button', { name: 'Bestätigen' }).first();
    await expect(ApproveButton).toBeVisible({ timeout: 1000 });
    await ApproveButton.click();

    const ModalDiv = admin.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible({ timeout: 1000 });

    const SecondApproveButton = ModalDiv.getByRole('button', { name: 'Bestätigen' }).first();
    await expect(SecondApproveButton).toBeVisible({ timeout: 1000 });
    await SecondApproveButton.click();

    const DownloadButton = AnfrageDiv.getByRole('button', { name: 'Herunterladen' }).first();
    await expect(DownloadButton).toBeVisible({ timeout: 1000 });

    await admin.close();
  });

  test('Alice see the approval and download her data', async () => {
    const host = shared.getHost();

    const alice = await browsers.newPage(browsers.alices_browser);

    await alice.goto(host);

    // navigate to the user setting page:
    const MessagesButton = alice.locator('a[href="/messages"]');
    await expect(MessagesButton).toBeVisible({ timeout: 1000 });
    await MessagesButton.click({ timeout: 1000 });

    const MessageButton = alice
      .locator('a')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(MessageButton).toBeVisible({ timeout: 5000 });
    await MessageButton.click();

    const AnfrageDiv = alice
      .locator('div')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible({ timeout: 5000 });

    const DownloadButton = AnfrageDiv.getByRole('button', { name: 'Herunterladen' }).first();
    await expect(DownloadButton).toBeVisible({ timeout: 5000 });
    await DownloadButton.click();

    const Download = await alice.waitForEvent('download');

    const Filename = await Download.suggestedFilename();

    await expect(Filename).toContain('data_export');

    await alice.close();
  });
});
