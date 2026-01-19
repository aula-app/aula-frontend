import { test, expect } from '../../fixtures/test-fixtures';
import * as navigation from '../../interactions/navigation';
import * as forms from '../../interactions/forms';
import * as shared from '../../support/utils';

/**
 * Message Management Tests
 * Tests message creation and delivery to individual users
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create message → 2. Send message to user → 3. Verify user receives message
 */
test.describe.serial('Message Management - User Messages', () => {
  let messageData: {
    headline: string;
    body: string;
    recipient: string;
  };

  test.beforeAll(async ({ userConfig }) => {
    messageData = {
      headline: shared.gensym(`test-message-`),
      body: `Test message sent to individual user`,
      recipient: userConfig.username,
    };
  });

  test('Admin can send a message to a user', async ({ adminPage }) => {
    await test.step('Navigate to messages settings', async () => {
      await navigation.goToMessagesSettings(adminPage);
    });

    await test.step('Click add message button', async () => {
      await forms.clickButton(adminPage, 'add-messages-button');
      await adminPage.waitForTimeout(500);
    });

    await test.step('Select user as message target', async () => {
      // Select the user from the autocomplete
      await forms.selectOptionByValue(adminPage, 'user-field-autocomplete-input', messageData.recipient);
    });

    await test.step('Fill message form', async () => {
      await forms.fillForm(adminPage, 'message-headline', messageData.headline);

      // Scope the markdown editor to the form
      const form = adminPage.locator('form').first();
      await forms.fillMarkdownForm(adminPage, 'body', messageData.body, form);
    });

    await test.step('Submit message', async () => {
      await forms.clickButton(adminPage, 'submit-message-form');
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(1000);
    });

    await test.step('Verify message was created in admin panel', async () => {
      const messageRow = adminPage.locator('table tr').filter({ hasText: messageData.headline });
      await expect(messageRow).toBeVisible();
    });
  });

  test('User receives the message', async ({ userPage }) => {
    await test.step('Navigate to messages', async () => {
      await navigation.goToMessages(userPage);
      await userPage.waitForLoadState('networkidle');
    });

    await test.step('Verify message is visible', async () => {
      const messageCard = userPage.getByText(messageData.headline);
      await expect(messageCard).toBeVisible({ timeout: 10000 });
    });
  });
});
