import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as shared from '../../shared/shared';
import * as fixtures from '../../fixtures/users';
import { goToProfile, goToRequests } from '../../shared/page_interactions/users';

describeWithSetup('Request user data flow', () => {

  //
  test('Alice can request user data', async () => {
    const host = shared.getHost();

    const alice = await BrowserHelpers.openPageForUser('alice');

    await alice.goto(host);

    await goToProfile(alice);

    // open datenschutz accordeon
    const DatenschutzAccordeon = alice.getByRole('button', { name: 'Datenschutz' });
    await expect(DatenschutzAccordeon).toBeVisible();
    await DatenschutzAccordeon.click({ timeout: 1000 });

    // press request data button
    const RequestDataButton = alice.getByRole('button', { name: 'Datenexport anfordern' });
    await expect(RequestDataButton).toBeVisible();
    await RequestDataButton.click({ timeout: 1000 });

    await BrowserHelpers.closePage(alice);
  });

  //
  test('Admin can approve the request', async () => {
    const host = shared.getHost();

    const admin = await BrowserHelpers.openPageForUser('admin');

    await admin.goto(host);

    await goToRequests(admin);

    const AnfrageDiv = admin
      .locator('div')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible();

    const ApproveButton = AnfrageDiv.getByTestId('confirm-request').first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click({ timeout: 1000 });

    const ModalDiv = admin.locator('div[role="dialog"]');
    await expect(ModalDiv).toBeVisible();

    const SecondApproveButton = ModalDiv.getByTestId('confirm-request-action').first();
    await expect(SecondApproveButton).toBeVisible();
    await SecondApproveButton.click({ timeout: 1000 });

    const DownloadButton = AnfrageDiv.getByRole('button', { name: 'Herunterladen' }).first();
    await expect(DownloadButton).toBeVisible();

    await BrowserHelpers.closePage(admin);
  });

  test('Alice see the approval and download her data', async () => {
    const host = shared.getHost();

    const alice = await BrowserHelpers.openPageForUser('alice');

    await alice.goto(host);

    // navigate to the user setting page:
    const MessagesButton = alice.locator('a[href="/messages"]');
    await expect(MessagesButton).toBeVisible();
    await MessagesButton.click({ timeout: 1000 });

    const MessageButton = alice
      .locator('a')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(MessageButton).toBeVisible();
    await MessageButton.click({ timeout: 1000 });

    const AnfrageDiv = alice
      .locator('div')
      .filter({ hasText: `Kontodatenexportanfrage für ${fixtures.alice.displayName}` })
      .first();
    await expect(AnfrageDiv).toBeVisible();

    const DownloadButton = AnfrageDiv.getByRole('button', { name: 'Herunterladen' }).first();
    await expect(DownloadButton).toBeVisible();
    await DownloadButton.click({ timeout: 1000 });

    const Download = await alice.waitForEvent('download');

    const Filename = await Download.suggestedFilename();

    await expect(Filename).toContain('data_export');

    await BrowserHelpers.closePage(alice);
  });
});
