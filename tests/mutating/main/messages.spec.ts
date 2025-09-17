import { expect, test } from '@playwright/test';
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
            const recipientRealName = MessageTestHelpers.getUserRealName('alice');

            // Use the navigation helper which has fallback strategies
            await context.messagesPage.navigateToMessages();

            const AddMessageButton = admin.getByTestId('add-messages-button');
            await expect(AddMessageButton).toBeVisible();
            await AddMessageButton.click({ timeout: 1000 });

            // Use the specific data-testid for the user field autocomplete
            await admin.getByTestId('user-field-autocomplete').click();

            // Wait for the dropdown to open and options to load
            await admin.waitForTimeout(1000);

            // Look for the specific user option by real name (more unique)
            const userOption = admin.locator(`[data-testid^="user-option-"]`).filter({ hasText: recipientRealName });
            await expect(userOption).toBeVisible({ timeout: 5000 });
            await userOption.first().click();

            // Generate message content once and reuse it
            const messageSubject = MessageTestHelpers.generateMessageSubject();
            const messageContent = MessageTestHelpers.generateMessageContent();

            // Use data-testid for title field - target the input element within the TextField
            const headlineField = admin.getByTestId('message-headline-input').locator('input');
            await headlineField.click();
            await headlineField.fill(messageSubject);

            // Use data-testid for markdown editor - with fallback selectors
            let markdownEditor = admin.getByTestId('markdown-editor-body');

            try {
              await expect(markdownEditor).toBeVisible({ timeout: 2000 });
            } catch {
              // Fallback: Look for the markdown editor by class or other selectors
              markdownEditor = admin.locator('.md-editor, .mdxeditor, [data-lexical-editor="true"]').first();

              try {
                await expect(markdownEditor).toBeVisible({ timeout: 2000 });
              } catch {
                // Fallback 2: Look for any contenteditable element
                markdownEditor = admin.locator('[contenteditable="true"]').first();
                await expect(markdownEditor).toBeVisible({ timeout: 2000 });
              }
            }

            // Find the actual editable content area within the markdown editor
            const editableArea = markdownEditor
              .locator('[contenteditable="true"], .cm-content, .mdxeditor-root-contenteditable')
              .first();
            await expect(editableArea).toBeVisible({ timeout: 5000 });

            // Find the actual paragraph element inside the contenteditable area
            const editableParagraph = editableArea.locator('p').first();
            await expect(editableParagraph).toBeVisible({ timeout: 5000 });
            await editableParagraph.click();
            await editableParagraph.fill(messageContent);

            // Use data-testid for submit button
            await admin.getByTestId('submit-message-form').click();

            // Navigate back to messages after sending
            await admin.getByTestId('navigation-messages').click();

            // Wait for the messages page to load
            await admin.waitForLoadState('networkidle');

            // Wait for any loading state to finish and messages to be displayed
            await admin.waitForTimeout(2000);

            // Verify the message appears in the list by checking for the subject/headline
            // The UserMessagesView displays messages as individual Stack components with text content
            const messageWithSubject = admin.locator(`text="${messageSubject}"`).first();
            await expect(messageWithSubject).toBeVisible({ timeout: 10000 });
          },
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });
});
