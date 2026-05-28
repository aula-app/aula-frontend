import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as forms from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

test('Announcements', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('Admin can make an announcement', async () => {
    await navigation.goToAnnouncementsSettings(adminPage);

    // Add announcement
    const NewButton = adminPage.locator('[data-testid="add-announcements-button"]');
    await expect(NewButton).toBeVisible();
    await NewButton.click();

    await adminPage.locator('input[name="headline"]').fill('Testing content');
    await adminPage.locator('div[contenteditable="true"]').fill('some data');

    // Make it obligatory to consent to the announcement
    await forms.selectOptionByValue(adminPage, "select-field-user_needs_to_consent", "2")

    // submit the idea form
    await adminPage.locator('button[type="submit"]').click();
    await adminPage.waitForTimeout(10); // 10ms just for the request to go out
    await adminPage.waitForLoadState("networkidle");
  });

  await test.step.skip('Admin sees own announcement', async () => {
    // refresh page at home
    await navigation.goToHome(adminPage);

    // assert that the dialog pops up
    const ModalDiv = adminPage.getByRole('dialog');
    await expect(ModalDiv).toBeVisible();

    // agree to consent
    const ApproveButton = ModalDiv.getByTestId('button-consent-agree').first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click();

    // assert that the dialog disappears
    await adminPage.waitForLoadState("networkidle");
    await expect(ModalDiv).not.toBeVisible();
    await expect(ApproveButton).not.toBeVisible();
  });

  await test.step('User sees the announcement, can consent to dismiss it', async () => {
    const userPage = await newPageFor('user');
    await navigation.goToHome(userPage);

    // announcement is there
    const ModalDiv = userPage.getByRole('dialog');
    await expect(ModalDiv).toBeVisible();

    // User can consent to dismiss the announcement
    const ApproveButton = ModalDiv.getByTestId('button-consent-agree').first();
    await expect(ApproveButton).toBeVisible();
    await ApproveButton.click();

    // assert that the dialog disappears
    await userPage.waitForLoadState("networkidle");
    await expect(ModalDiv).not.toBeVisible();
    await expect(ApproveButton).not.toBeVisible();
  });

  await test.step('Admin deletes all announcements', async () => {
    await navigation.goToAnnouncementsSettings(adminPage);

    // click on selectAll checkbox
    await adminPage.locator('input[type="checkbox"]').first().click();

    // click on remove selected announcements
    const DeleteButton = adminPage.getByTestId("remove-announcements-button");
    await expect(DeleteButton).toBeVisible();
    await DeleteButton.click();

    // confirm deletion
    const Dialog = adminPage.getByRole('dialog');
    await expect(Dialog).toBeVisible();
    const ConfirmButton = Dialog.getByTestId('confirm-delete-announcements-button');
    await expect(ConfirmButton).toBeVisible();
    await ConfirmButton.click();
    await expect(Dialog).not.toBeVisible();
  });

  await test.step("Student (another user) now doesn't see the announcement", async () => {
    const studentPage = await newPageFor('student');
    await navigation.goToProfile(studentPage);

    const ModalDiv = studentPage.getByRole('dialog');
    await expect(ModalDiv).not.toBeVisible();
  });
});
