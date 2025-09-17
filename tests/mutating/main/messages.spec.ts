import { test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { MessageTestHelpers, MessageTestContext } from '../../shared/helpers/messages';

describeWithSetup('Messages flow', () => {
  // Track cleanup contexts for emergency cleanup
  const cleanupQueue: Array<{ page: any; context: MessageTestContext }> = [];

  test.afterEach(async () => {
    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await MessageTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test.describe('Admin can send message to Alice', () => {
    test('Admin can send a message to Alice', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await MessageTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            const recipientName = MessageTestHelpers.getRecipientName('alice');
            const senderName = MessageTestHelpers.getSenderName('admin');
            await page.getByRole('menuitem', { name: 'Nachrichten' }).click();
            await page.getByTestId('add-messages-button').click();
            await page.getByRole('combobox', { name: 'Benutzer', exact: true }).click();
            await page.getByText(recipientName).click();
            await page.getByRole('textbox', { name: 'Titel' }).click();
            await page.getByRole('textbox', { name: 'Titel' }).fill(MessageTestHelpers.generateMessageSubject());
            await page.getByRole('textbox', { name: 'editable markdown' }).getByRole('paragraph').click();
            await page
              .getByRole('textbox', { name: 'editable markdown' })
              .fill(MessageTestHelpers.generateMessageContent());
            await page.getByRole('button', { name: 'Bestätigen' }).click();
            await page.getByRole('menuitem', { name: 'Nachrichten' }).click();
            await MessageTestHelpers.testBasicMessageFlow(context, alice, recipientName, senderName);
          },
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(alice);
        await BrowserHelpers.closePage(admin);
      }
    });
  });
});
