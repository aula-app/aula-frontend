import { expect, test } from '../../fixtures/db-backchannel/new-fixture';
import * as forms from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

/**
 * Message Management Tests
 * Tests message creation and delivery to individual users
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create message → 2. Send message to user → 3. Verify user receives message
 */
test('Message Management - User Messages', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const messageData: {
    headline: string;
    body: string;
  } = {
    headline: shared.gensym(`test-message-`),
    body: `Test message sent to individual user`,
  };

  await test.step('Admin can send a message to a user', async () => {
    await navigation.goToMessagesSettings(adminPage);
    //Click add message button
    await forms.clickButton(adminPage, 'add-messages-button');
    await adminPage.getByTestId('user-field-autocomplete-input').waitFor({ state: 'visible' });

    // Select the user from the autocomplete
    await forms.selectMultiAutocompleteOption(adminPage, 'user-field-autocomplete-input', seededUser.username);

    // Fill & Submit Message form
    await forms.fillForm(adminPage, 'message-headline', messageData.headline);
    await forms.fillMarkdownForm(adminPage, 'body', messageData.body);
    await forms.clickButton(adminPage, 'submit-message-form');

    // Verify message was created in admin panel
    const messageRow = adminPage.locator('table tr').filter({ hasText: messageData.headline });
    await expect(messageRow).toBeVisible();
  });

  await test.step('User receives the message', async () => {
    await navigation.goToMessages(userPage);

    // Verify message is visible
    const messageCard = userPage.getByText(messageData.headline);
    await expect(messageCard).toBeVisible();
  });

  await test.step('Admin can delete a message', async () => {
    // Verify message is visible
    await navigation.goToMessagesSettings(adminPage);
    await expect(adminPage.locator('table tr').filter({ hasText: messageData.headline })).toBeVisible();

    // Ensure checkbox is unchecked first, then check it
    const checkbox = (adminPage.locator('table tr').filter({ hasText: messageData.headline })).locator('input');
    await expect(checkbox).toBeVisible();
    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
    }
    await checkbox.check();

    // Delete the message
    await forms.clickButton(adminPage, 'remove-messages-button');
    await forms.clickButton(adminPage, 'confirm-delete-messages-button');

    //Verify message is no longer in the list
    await expect(adminPage.locator('table tr').filter({ hasText: messageData.headline })).toHaveCount(0);
  });

  await test.step('User verifies message is no longer visible', async () => {
    await navigation.goToMessages(userPage);
    const messageCard = userPage.getByText(messageData.headline);
    await expect(messageCard).toHaveCount(0);
  });
});
