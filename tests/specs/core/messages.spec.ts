import { test, expect } from '../../fixtures/test-fixtures';
import * as types from '../../support/types';
import * as messages from '../../interactions/messages';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

/**
 * Message Management Tests
 * Tests message creation, delivery, and deletion
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Send message → Receive message → Delete message → Verify deletion
 */
test.describe.serial('Messages flow', () => {
  let messageData: types.MessageData;

  test.beforeAll(async ({ userConfig }) => {
    messageData = {
      user: userConfig,
      title: shared.gensym(`Test Message Title `),
      content: `This is a test message content generated during automated testing. Run ID: ${shared.getRunId()}`,
    };
  });

  test('Admin can send a message to a user', async ({ adminPage }) => {
    await test.step('Create message to user', async () => {
      await messages.create(adminPage, messageData);
    });
  });

  test('User receives a message from admin', async ({ userPage }) => {
    await test.step('Navigate to messages', async () => {
      await navigation.goToMessages(userPage);
    });

    await test.step('Verify message is visible', async () => {
      const messageWithSubject = userPage.locator(`text="${messageData.title}"`).first();
      await expect(messageWithSubject).toBeVisible({ timeout: 10000 });
    });
  });

  test('Admin can delete a message', async ({ adminPage }) => {
    await test.step('Delete message', async () => {
      await messages.remove(adminPage, messageData);
    });
  });

  test('Message is no longer available to User', async ({ userPage }) => {
    await test.step('Navigate to messages page', async () => {
      await navigation.goToHome(userPage);
      await navigation.goToMessages(userPage);
    });

    await test.step('Verify message is no longer visible', async () => {
      const messageWithSubject = userPage.locator(`text="${messageData.title}"`).first();
      await expect(messageWithSubject).not.toBeVisible({ timeout: 10000 });
    });
  });
});
