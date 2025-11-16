import { test } from '@playwright/test';
import { describeWithSetup } from '../../../lifecycle/base-test';

describeWithSetup('Admin announcements', () => {
  //
  test('OFF - Admin can change make an announcement, sees own announcement', async () => {
    /* const admin = await BrowserHelpers.openPageForUser('admin');

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

    BrowserHelpers.closePage(admin); */
  });

  test('OFF - Alice also sees the announcement', async () => {
    /*   const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

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

    BrowserHelpers.closePage(alice);
    BrowserHelpers.closePage(admin); */
  });
});
