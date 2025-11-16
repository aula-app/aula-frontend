import { test, expect } from '../../fixtures/test-fixtures';
import * as types from "../support/types";
import { describeWithSetup } from '../../lifecycle/base-test';
import * as messages from '../../interactions/messages';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

describeWithSetup('Messages flow', () => {
  let messageData: types.MessageData;

  test.beforeAll(async ({ userConfig }) => {
    messageData = {
      user: userConfig,
      title: shared.gensym(`Test Message Title `),
      content: `This is a test message content generated during automated testing. Run ID: ${shared.getRunId()}`,
    };
  });

  test('Admin can send a message to a user', async ({ adminPage }) => {
    await messages.create(adminPage, messageData);
  });

  test('User receives a message from admin', async ({ userPage }) => {
    await navigation.goToMessages(userPage);

    const messageWithSubject = userPage.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).toBeVisible({ timeout: 10000 });
  });

  test('Admin can delete a message', async ({ adminPage }) => {
    await messages.remove(adminPage, messageData);
  });

  test('Message is no longer available to User', async ({ userPage }) => {
    await navigation.goToHome(userPage);
    await navigation.goToMessages(userPage);

    const messageWithSubject = userPage.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).not.toBeVisible({ timeout: 10000 });
  });
});
