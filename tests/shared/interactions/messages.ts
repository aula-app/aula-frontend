import { Page, expect } from '@playwright/test';
import * as shared from '../shared';

export class MessagesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get selectors() {
    return {
      // Navigation
      messagesNavigation: 'navigation-messages',
      composeButton: 'compose-message-button',

      // Message composition
      messageComposer: 'message-composer',
      recipientField: 'message-recipient-field',
      recipientSearch: 'recipient-search-input',
      recipientDropdown: 'recipient-dropdown',
      subjectField: 'message-subject-field',
      messageContentField: 'message-content-field',
      sendButton: 'send-message-button',
      cancelButton: 'cancel-message-button',

      // Message list
      messagesList: 'messages-list',
      messageItem: 'message-item',
      messagePreview: 'message-preview',
      messageSubject: 'message-subject',
      messageSender: 'message-sender',
      messageDate: 'message-date',
      unreadIndicator: 'unread-indicator',

      // Message view
      messageView: 'message-view',
      messageHeader: 'message-header',
      messageBody: 'message-body',
      replyButton: 'reply-message-button',
      deleteButton: 'delete-message-button',
      markAsReadButton: 'mark-as-read-button',

      // Empty state
      emptyState: 'messages-empty-state',
      noMessagesText: 'no-messages-text',
    };
  }

  private get timeouts() {
    return {
      default: 10000,
      short: 5000,
      wait: 1000,
      send: 3000,
    };
  }

  async navigateToMessages(): Promise<void> {
    await this.page.goto(shared.getHost());

    // Try multiple strategies to navigate to messages
    let messagesButton = this.page.getByTestId(this.selectors.messagesNavigation);

    try {
      await expect(messagesButton).toBeVisible({ timeout: this.timeouts.short });
    } catch {
      // Fallback: Look for messages in navigation
      messagesButton = this.page
        .locator(
          'nav a:has-text("Messages"), nav a:has-text("Nachrichten"), nav button:has-text("Messages"), nav button:has-text("Nachrichten")'
        )
        .first();

      try {
        await expect(messagesButton).toBeVisible({ timeout: this.timeouts.short });
      } catch {
        // Fallback 2: Direct navigation
        await this.page.goto(`${shared.getHost()}/messages`);
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }

    await messagesButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openComposeMessage(): Promise<void> {
    const composeButton = this.page.getByTestId(this.selectors.composeButton);
    await expect(composeButton).toBeVisible({ timeout: this.timeouts.default });
    await composeButton.click();

    // Wait for composer to be visible
    const composer = this.page.getByTestId(this.selectors.messageComposer);
    await expect(composer).toBeVisible({ timeout: this.timeouts.default });
  }

  async selectRecipient(recipientName: string): Promise<void> {
    // Click on recipient field to open search
    const recipientField = this.page.getByTestId(this.selectors.recipientField);
    await expect(recipientField).toBeVisible({ timeout: this.timeouts.default });
    await recipientField.click();

    // Type recipient name
    const searchInput = this.page.getByTestId(this.selectors.recipientSearch);
    await expect(searchInput).toBeVisible({ timeout: this.timeouts.default });
    await searchInput.fill(recipientName);
    await this.page.waitForTimeout(this.timeouts.wait); // Wait for search results

    // Select recipient from dropdown
    const recipientOption = this.page.locator(
      `[data-testid="${this.selectors.recipientDropdown}"] >> text="${recipientName}"`
    );
    await expect(recipientOption).toBeVisible({ timeout: this.timeouts.default });
    await recipientOption.click();
  }

  async fillSubject(subject: string): Promise<void> {
    const subjectField = this.page.getByTestId(this.selectors.subjectField);
    await expect(subjectField).toBeVisible({ timeout: this.timeouts.default });
    await subjectField.fill(subject);
  }

  async fillMessageContent(content: string): Promise<void> {
    const contentField = this.page.getByTestId(this.selectors.messageContentField);
    await expect(contentField).toBeVisible({ timeout: this.timeouts.default });
    await contentField.fill(content);
  }

  async sendMessage(): Promise<void> {
    const sendButton = this.page.getByTestId(this.selectors.sendButton);
    await expect(sendButton).toBeVisible({ timeout: this.timeouts.default });
    await expect(sendButton).toBeEnabled({ timeout: this.timeouts.default });
    await sendButton.click();

    // Wait for message to be sent (composer should close)
    const composer = this.page.getByTestId(this.selectors.messageComposer);
    await expect(composer).not.toBeVisible({ timeout: this.timeouts.send });
  }

  async cancelMessage(): Promise<void> {
    const cancelButton = this.page.getByTestId(this.selectors.cancelButton);
    await expect(cancelButton).toBeVisible({ timeout: this.timeouts.default });
    await cancelButton.click();

    // Wait for composer to close
    const composer = this.page.getByTestId(this.selectors.messageComposer);
    await expect(composer).not.toBeVisible({ timeout: this.timeouts.default });
  }

  async composeAndSendMessage(recipient: string, subject: string, content: string): Promise<void> {
    await this.openComposeMessage();
    await this.selectRecipient(recipient);
    await this.fillSubject(subject);
    await this.fillMessageContent(content);
    await this.sendMessage();
  }

  async verifyMessageInList(subject: string): Promise<void> {
    const messagesList = this.page.getByTestId(this.selectors.messagesList);
    await expect(messagesList).toBeVisible({ timeout: this.timeouts.default });

    const messageWithSubject = messagesList.locator(`text="${subject}"`);
    await expect(messageWithSubject).toBeVisible({ timeout: this.timeouts.default });
  }

  async verifyMessageFromSender(senderName: string): Promise<void> {
    const messagesList = this.page.getByTestId(this.selectors.messagesList);
    await expect(messagesList).toBeVisible({ timeout: this.timeouts.default });

    const messageFromSender = messagesList.locator(`text="${senderName}"`);
    await expect(messageFromSender).toBeVisible({ timeout: this.timeouts.default });
  }

  async openMessage(subject: string): Promise<void> {
    const messagesList = this.page.getByTestId(this.selectors.messagesList);
    await expect(messagesList).toBeVisible({ timeout: this.timeouts.default });

    const messageItem = messagesList
      .locator(`[data-testid="${this.selectors.messageItem}"]`)
      .filter({ hasText: subject });
    await expect(messageItem).toBeVisible({ timeout: this.timeouts.default });
    await messageItem.click();

    // Wait for message view to open
    const messageView = this.page.getByTestId(this.selectors.messageView);
    await expect(messageView).toBeVisible({ timeout: this.timeouts.default });
  }

  async verifyMessageContent(expectedContent: string): Promise<void> {
    const messageBody = this.page.getByTestId(this.selectors.messageBody);
    await expect(messageBody).toBeVisible({ timeout: this.timeouts.default });
    await expect(messageBody).toContainText(expectedContent);
  }

  async replyToMessage(replyContent: string): Promise<void> {
    const replyButton = this.page.getByTestId(this.selectors.replyButton);
    await expect(replyButton).toBeVisible({ timeout: this.timeouts.default });
    await replyButton.click();

    // Fill reply content
    await this.fillMessageContent(replyContent);
    await this.sendMessage();
  }

  async deleteMessage(): Promise<void> {
    const deleteButton = this.page.getByTestId(this.selectors.deleteButton);
    await expect(deleteButton).toBeVisible({ timeout: this.timeouts.default });
    await deleteButton.click();

    // Wait for message to be deleted (should return to messages list)
    const messagesList = this.page.getByTestId(this.selectors.messagesList);
    await expect(messagesList).toBeVisible({ timeout: this.timeouts.default });
  }

  async getMessageCount(): Promise<number> {
    try {
      const messagesList = this.page.getByTestId(this.selectors.messagesList);
      await expect(messagesList).toBeVisible({ timeout: this.timeouts.short });

      const messageItems = messagesList.locator(`[data-testid="${this.selectors.messageItem}"]`);
      return await messageItems.count();
    } catch {
      return 0;
    }
  }

  async verifyEmptyState(): Promise<void> {
    const emptyState = this.page.getByTestId(this.selectors.emptyState);
    await expect(emptyState).toBeVisible({ timeout: this.timeouts.default });
  }

  async verifyUnreadIndicator(subject: string): Promise<void> {
    const messagesList = this.page.getByTestId(this.selectors.messagesList);
    const messageItem = messagesList
      .locator(`[data-testid="${this.selectors.messageItem}"]`)
      .filter({ hasText: subject });
    const unreadIndicator = messageItem.locator(`[data-testid="${this.selectors.unreadIndicator}"]`);

    await expect(unreadIndicator).toBeVisible({ timeout: this.timeouts.default });
  }

  async markAsRead(subject: string): Promise<void> {
    await this.openMessage(subject);

    try {
      const markAsReadButton = this.page.getByTestId(this.selectors.markAsReadButton);
      await markAsReadButton.click({ timeout: this.timeouts.short });
    } catch {
      // Message might already be marked as read automatically
    }
  }
}
