import { test } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as browsers from '../../shared/interactions/browsers';
import * as messages from '../../shared/interactions/messages';
import * as shared from '../../shared/shared';
import * as types from '../../fixtures/types';

describeWithSetup('Messages flow', () => {
  let admin: any;
  let messageData: types.MessageData;

  const cleanupQueue = {
    message: false,
  };

  test.beforeAll(async () => {
    admin = await browsers.newPage(browsers.admins_browser);

    messageData = {
      user: userData.testUsers.alice(),
      title: shared.gensym(`Test Message Title `),
      content: `This is a test message content generated during automated testing. Run ID: ${shared.getRunId()}`,
    };
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
    ('');
  });

  test.afterAll(async () => {
    if (cleanupQueue.message) await messages.remove(admin, messageData);
    await admin.close();
  });

  test('Admin can send a message to a user', async () => {
    cleanupQueue.message = true;
    await messages.create(admin, messageData);
  });

  // test('User receives a message from admin', async () => {
  //   await messages.create(admin, messageData);
  // });

  test('Admin can delete a message', async () => {
    cleanupQueue.message = false;
    await messages.remove(admin, messageData);
  });
});
