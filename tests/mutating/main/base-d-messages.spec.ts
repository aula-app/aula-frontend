import { test, expect } from '@playwright/test';
import * as types from '../../fixtures/types';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as messages from '../../shared/interactions/messages';
import * as navigation from '../../shared/interactions/navigation';
import * as shared from '../../shared/shared';

describeWithSetup('Messages flow', () => {
  let admin: any;
  let user: any;

  let messageData: types.MessageData;

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);

    messageData = {
      user: user1Data,
      title: shared.gensym(`Test Message Title `),
      content: `This is a test message content generated during automated testing. Run ID: ${shared.getRunId()}`,
    };
  });

  test('Admin can send a message to a user', async () => {
    await messages.create(admin, messageData);
  });

  test('User receives a message from admin', async () => {
    await navigation.goToMessages(user);

    const messageWithSubject = user.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).toBeVisible({ timeout: 10000 });
  });

  test('Admin can delete a message', async () => {
    await messages.remove(admin, messageData);
  });

  test('Message is no longer available to User', async () => {
    await navigation.goToHome(user);
    await navigation.goToMessages(user);

    const messageWithSubject = user.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).not.toBeVisible({ timeout: 10000 });
  });
});
