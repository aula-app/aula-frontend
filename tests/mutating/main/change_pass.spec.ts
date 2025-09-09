import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as shared from '../../shared/shared';
import * as users from '../../shared/page_interactions/users';
import * as fixtures from '../../fixtures/users';

describeWithSetup('Change pass flow', () => {

  //
  test('Alice can change her password', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

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

    const SuccessDiv = alice.getByTestId('success-message')
      .or(alice.locator('[data-testid*="success"]'))
      .or(alice.locator('.MuiAlert-root').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .or(alice.locator('[class*="success"]').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .first();
    await expect(SuccessDiv).toBeVisible();

    await BrowserHelpers.closePage(alice);
  });

  test('Alice can change her password back', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

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

    const SuccessDiv = alice.getByTestId('success-message')
      .or(alice.locator('[data-testid*="success"]'))
      .or(alice.locator('.MuiAlert-root').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .or(alice.locator('[class*="success"]').filter({ hasText: 'Passwort erfolgreich geändert' }))
      .first();
    await expect(SuccessDiv).toBeVisible();

    await BrowserHelpers.closePage(alice);
  });
});
