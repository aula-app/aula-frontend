import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as forms from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

type AnnouncementOptions = { headline: string; body: string; consentValue: string };

const createAnnouncement = async (
  adminPage: import('@playwright/test').Page,
  { headline, body, consentValue }: AnnouncementOptions
) => {
  await navigation.goToAnnouncementsSettings(adminPage);
  await forms.clickButton(adminPage, 'add-announcements-button');
  await adminPage.locator('input[name="headline"]').fill(headline);
  await adminPage.getByTestId('markdown-editor-body').locator('div[contenteditable="true"]').fill(body);
  await forms.selectOptionByValue(adminPage, 'select-field-user_needs_to_consent', consentValue);
  await adminPage.locator('button[type="submit"]').click();
  await adminPage.waitForTimeout(10);
  await adminPage.waitForLoadState('networkidle');
};

/**
 * Obligatory consent (user_needs_to_consent = 2 / "alert"):
 * - Only the agree button is shown (no dismiss)
 * - User must agree to close the dialog
 */
test('Announcements - obligatory consent', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('Admin creates an obligatory announcement', async () => {
    await createAnnouncement(adminPage, {
      headline: shared.gensym('announcement-'),
      body: 'obligatory announcement body',
      consentValue: '2',
    });
  });

  await test.step('Admin also sees own announcement and agrees to it', async () => {
    await navigation.goToHome(adminPage);
    const modal = adminPage.getByRole('dialog');
    await expect(modal).toBeVisible();
    const agreeButton = modal.getByTestId('button-consent-agree').first();
    await expect(agreeButton).toBeVisible();
    await agreeButton.click();
    await adminPage.waitForLoadState('networkidle');
    await expect(modal).not.toBeVisible();
  });

  await test.step('User sees dialog with agree button only — no dismiss for obligatory', async () => {
    const userPage = await newPageFor('user');
    await navigation.goToHome(userPage);

    const modal = userPage.getByRole('dialog');
    await expect(modal).toBeVisible();

    const agreeButton = modal.getByTestId('button-consent-agree').first();
    await expect(agreeButton).toBeVisible();
    await expect(modal.getByTestId('button-consent-dismiss')).not.toBeVisible();

    await agreeButton.click();
    await userPage.waitForLoadState('networkidle');
    await expect(modal).not.toBeVisible();
  });

  await test.step('Student still sees the announcement (per-user consent)', async () => {
    const studentPage = await newPageFor('student');
    await navigation.goToHome(studentPage);
    await expect(studentPage.getByRole('dialog')).toBeVisible();
  });
});

/**
 * Optional consent (user_needs_to_consent = 1 / "announcement"):
 * - Both agree and dismiss buttons are shown
 * - User can dismiss without formally consenting
 */
test('Announcements - optional consent', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('Admin creates an optional announcement', async () => {
    await createAnnouncement(adminPage, {
      headline: shared.gensym('announcement-'),
      body: 'optional announcement body',
      consentValue: '1',
    });
  });

  await test.step('User sees dialog with both agree and dismiss buttons', async () => {
    const userPage = await newPageFor('user');
    await navigation.goToHome(userPage);

    const modal = userPage.getByRole('dialog');
    await expect(modal).toBeVisible();

    await expect(modal.getByTestId('button-consent-agree').first()).toBeVisible();
    const dismissButton = modal.getByTestId('button-consent-dismiss').first();
    await expect(dismissButton).toBeVisible();

    await dismissButton.click();
    await userPage.waitForLoadState('networkidle');
    await expect(modal).not.toBeVisible();
  });
});

/**
 * Admin management flow:
 * - Admin can delete announcements
 * - Users no longer see the announcement after deletion
 */
test('Announcements - admin delete flow', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('Admin creates an announcement', async () => {
    await createAnnouncement(adminPage, {
      headline: shared.gensym('announcement-'),
      body: 'some data',
      consentValue: '2',
    });
  });

  await test.step('Admin agrees to own announcement before managing settings', async () => {
    // goToHome always navigates, triggering the Announcement component to refetch.
    // goToAnnouncementsSettings would short-circuit (already on that URL) and the dialog would never appear.
    await navigation.goToHome(adminPage);
    const announcementModal = adminPage.getByRole('dialog');
    await expect(announcementModal).toBeVisible();
    await announcementModal.getByTestId('button-consent-agree').first().click();
    await adminPage.waitForLoadState('networkidle');
    await expect(announcementModal).not.toBeVisible();
  });

  await test.step('Admin deletes all announcements', async () => {
    await navigation.goToAnnouncementsSettings(adminPage);
    await adminPage.locator('input[type="checkbox"]').first().click();

    await forms.clickButton(adminPage, 'remove-announcements-button');

    // Scope to the delete confirmation dialog to avoid collision with the announcement dialog
    const deleteDialog = adminPage
      .getByRole('dialog')
      .filter({ has: adminPage.getByTestId('confirm-delete-announcements-button') });
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByTestId('confirm-delete-announcements-button').click();
    await expect(deleteDialog).not.toBeVisible();
  });

  await test.step('Student does not see the announcement after deletion', async () => {
    const studentPage = await newPageFor('student');
    await navigation.goToProfile(studentPage);
    await expect(studentPage.getByRole('dialog')).not.toBeVisible();
  });
});
