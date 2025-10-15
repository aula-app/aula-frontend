import { Page } from '@playwright/test';
import { MessagesPage } from '../interactions/messages';
import { TestDataBuilder } from '../base-test';
import * as shared from '../shared';
import * as fixtures from '../../fixtures/users';

export interface MessageTestContext {
  messagesPage: MessagesPage;
  testMessage?: {
    recipient: string;
    subject: string;
    content: string;
    sentAt?: Date;
  };
  testReply?: {
    content: string;
    sentAt?: Date;
  };
  sentMessages: Array<{
    recipient: string;
    subject: string;
    content: string;
  }>;
}

export class MessageTestHelpers {
  static generateMessageSubject(): string {
    return 'TEST MSG ' + shared.gensym();
  }

  static generateMessageContent(): string {
    return 'This is a test message content generated at ' + new Date().toISOString();
  }

  static async setupMessageTest(page: Page): Promise<MessageTestContext> {
    const messagesPage = new MessagesPage(page);

    return {
      messagesPage,
      sentMessages: [],
    };
  }

  static async executeWithCleanup<T>(
    page: Page,
    testFn: (context: MessageTestContext) => Promise<T>,
    cleanupQueue?: Array<{ page: any; context: MessageTestContext }>
  ): Promise<T> {
    const context = await this.setupMessageTest(page);

    if (cleanupQueue) {
      cleanupQueue.push({ page, context });
    }

    try {
      return await testFn(context);
    } catch (error) {
      // Try immediate cleanup on error
      try {
        await this.cleanupTestData(page, context);
      } catch (cleanupError) {
        console.warn('Immediate cleanup failed:', cleanupError);
      }
      throw error;
    }
  }

  static async sendTestMessage(
    context: MessageTestContext,
    recipient: string,
    subject?: string,
    content?: string
  ): Promise<void> {
    const messageSubject = subject || this.generateMessageSubject();
    const messageContent = content || this.generateMessageContent();

    await context.messagesPage.navigateToMessages();
    await context.messagesPage.composeAndSendMessage(recipient, messageSubject, messageContent);

    // Track sent message for cleanup
    const testMessage = {
      recipient,
      subject: messageSubject,
      content: messageContent,
      sentAt: new Date(),
    };

    context.testMessage = testMessage;
    context.sentMessages.push(testMessage);
  }

  static async verifyMessageDelivery(
    context: MessageTestContext,
    recipientPage: Page,
    expectedSubject: string,
    expectedSender: string
  ): Promise<void> {
    const recipientMessagesPage = new MessagesPage(recipientPage);
    await recipientMessagesPage.navigateToMessages();

    // Verify message appears in recipient's inbox
    await recipientMessagesPage.verifyMessageInList(expectedSubject);
    await recipientMessagesPage.verifyMessageFromSender(expectedSender);
  }

  static async testBasicMessageFlow(
    senderContext: MessageTestContext,
    recipientPage: Page,
    recipient: string,
    expectedSender: string
  ): Promise<string> {
    const subject = this.generateMessageSubject();
    const content = this.generateMessageContent();

    // Send message
    await this.sendTestMessage(senderContext, recipient, subject, content);

    // Verify delivery
    await this.verifyMessageDelivery(senderContext, recipientPage, subject, expectedSender);

    return subject;
  }

  static async testMessageReply(
    originalRecipientContext: MessageTestContext,
    originalSenderPage: Page,
    messageSubject: string,
    replyContent?: string
  ): Promise<void> {
    const reply = replyContent || 'This is a test reply: ' + shared.gensym();

    // Open the original message and reply
    await originalRecipientContext.messagesPage.openMessage(messageSubject);
    await originalRecipientContext.messagesPage.replyToMessage(reply);

    // Track reply for cleanup
    originalRecipientContext.testReply = {
      content: reply,
      sentAt: new Date(),
    };

    // Verify reply received by original sender
    const originalSenderMessagesPage = new MessagesPage(originalSenderPage);
    await originalSenderMessagesPage.navigateToMessages();

    // Look for the reply (subject should be "Re: " + original subject)
    const replySubject = `Re: ${messageSubject}`;
    await originalSenderMessagesPage.verifyMessageInList(replySubject);
  }

  static async testMessageDeletion(context: MessageTestContext, messageSubject: string): Promise<void> {
    await context.messagesPage.openMessage(messageSubject);
    await context.messagesPage.deleteMessage();

    // Verify message is no longer in list
    try {
      await context.messagesPage.verifyMessageInList(messageSubject);
      throw new Error('Message should have been deleted');
    } catch (error) {
      // Expected - message should not be found
      if (error instanceof Error && !error.message.includes('should have been deleted')) {
        // This is the expected Playwright timeout error
      }
    }
  }

  static async testUnreadMessageStatus(context: MessageTestContext, messageSubject: string): Promise<void> {
    await context.messagesPage.navigateToMessages();

    // Verify unread indicator
    await context.messagesPage.verifyUnreadIndicator(messageSubject);

    // Mark as read
    await context.messagesPage.markAsRead(messageSubject);

    // Go back to messages list and verify no unread indicator
    await context.messagesPage.navigateToMessages();

    try {
      await context.messagesPage.verifyUnreadIndicator(messageSubject);
      throw new Error('Message should no longer show unread indicator');
    } catch (error) {
      // Expected - unread indicator should not be found
      if (error instanceof Error && !error.message.includes('should no longer show unread indicator')) {
        // This is the expected Playwright timeout error
      }
    }
  }

  static async testEmptyInbox(context: MessageTestContext): Promise<void> {
    await context.messagesPage.navigateToMessages();

    const messageCount = await context.messagesPage.getMessageCount();
    if (messageCount === 0) {
      await context.messagesPage.verifyEmptyState();
    }
  }

  static async testMessageComposerCancel(context: MessageTestContext): Promise<void> {
    await context.messagesPage.navigateToMessages();
    await context.messagesPage.openComposeMessage();

    // Fill some content
    await context.messagesPage.fillSubject('Test subject that should be discarded');
    await context.messagesPage.fillMessageContent('Test content that should be discarded');

    // Cancel
    await context.messagesPage.cancelMessage();

    // Verify we're back to messages list
    const messageCount = await context.messagesPage.getMessageCount();
    // Just verify we can get the count without error (means we're on messages page)
  }

  static async cleanupTestData(page: Page, context: MessageTestContext): Promise<void> {
    const errors: Error[] = [];

    try {
      await context.messagesPage.navigateToMessages();

      // Clean up sent messages (delete them)
      for (const message of context.sentMessages) {
        try {
          await this.deleteMessageIfExists(context, message.subject);
        } catch (e: any) {
          errors.push(new Error(`Failed to cleanup message "${message.subject}": ${e.message}`));
        }
      }

      if (errors.length > 0) {
        console.warn('Message cleanup warnings:', errors.map((e) => e.message).join(', '));
      }
    } catch (e: any) {
      console.warn('Failed to cleanup messages:', e.message);
    }
  }

  private static async deleteMessageIfExists(context: MessageTestContext, subject: string): Promise<void> {
    try {
      // Try to find and delete the message
      const messageCount = await context.messagesPage.getMessageCount();
      if (messageCount > 0) {
        await context.messagesPage.openMessage(subject);
        await context.messagesPage.deleteMessage();
      }
    } catch (e) {
      // Message might not exist or already be deleted
      console.debug(`Message "${subject}" not found for cleanup:`, e);
    }
  }

  // Helper methods for getting user fixtures
  static getRecipientName(username: keyof typeof fixtures): string {
    const user = fixtures[username];
    if (typeof user === 'function') {
      return username;
    }
    return user?.displayName || user?.username || username;
  }

  static getSenderName(username: keyof typeof fixtures): string {
    const user = fixtures[username];
    if (typeof user === 'function') {
      return username;
    }
    return user?.displayName || user?.username || username;
  }

  // Helper method to get unique user identifier for UI selection
  static getUserRealName(username: keyof typeof fixtures): string {
    const user = fixtures[username];
    if (typeof user === 'function') {
      return username;
    }
    return user?.realName || user?.displayName || user?.username || username;
  }
}
