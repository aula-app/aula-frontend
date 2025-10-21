import { test, expect } from '@playwright/test';
import * as types from '../../fixtures/types';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as messages from '../../shared/interactions/messages';
import * as navigation from '../../shared/interactions/navigation';
import * as formInteractions from '../../shared/interactions/forms';
import * as shared from '../../shared/shared';

describeWithSetup('Messages flow', () => {
  let admin: any;
  let user: any;
  let student: any;

  let messageData: types.MessageData;
  let groupData: any;

  const cleanupQueue = {
    message: false,
    group: false,
  };

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('student');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);

    messageData = {
      user: user1Data,
      title: shared.gensym(`Test Message Title `),
      content: `This is a test message content generated during automated testing. Run ID: ${shared.getRunId()}`,
    };

    groupData = {
      group_name: shared.gensym(`test-group-`),
      description_public: `test group created in e2e tests`,
      users: [user1Data.username, user2Data.username],
    };
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  test.afterAll(async () => {
    if (cleanupQueue.message) await messages.remove(admin, messageData);
    await admin.close();
  });

  test('Admin can send a message to a user', async () => {
    cleanupQueue.message = true;
    await messages.create(admin, messageData);
  });

  test('User receives a message from admin', async () => {
    await navigation.goToMessages(user);

    const messageWithSubject = user.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).toBeVisible({ timeout: 10000 });
  });

  test('Admin can delete a message', async () => {
    cleanupQueue.message = false;
    await messages.remove(admin, messageData);
  });

  test('Message is no longer available to User', async () => {
    await navigation.goToHome(user);
    await navigation.goToMessages(user);

    const messageWithSubject = user.locator(`text="${messageData.title}"`).first();
    await expect(messageWithSubject).not.toBeVisible({ timeout: 10000 });
  });

  test('Admin create a group', async () => {
    await navigation.goToSettings(admin);
    await navigation.openAccordion(admin, 'config-accordion-group');
    await formInteractions.clickButton(admin, 'add-group-chip');

    await formInteractions.fillForm(admin, 'group-name-field', groupData.group_name);
    await formInteractions.fillMarkdownForm(admin, 'markdown-editor-description_public', groupData.description_public);
    groupData.users.forEach(async (username: string) => {
      await formInteractions.selectAutocompleteOption(admin, 'users-field', username);
    });
  });
});
