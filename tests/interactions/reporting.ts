import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';

/**
 * Report Types - maps to backend reporting categories
 */
export const REPORT_TYPES = {
  MISINFORMATION: 'misinformation',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
} as const;

/**
 * Report an idea as inappropriate
 * @param page - User's page
 * @param room - Room containing the idea
 * @param ideaName - Name of the idea to report
 * @param reportType - Type of report (misinformation, spam, harassment)
 * @param reportContent - Detailed reason for the report
 */
export const reportIdea = async (
  page: Page,
  room: types.RoomData,
  ideaName: string,
  reportType: string = REPORT_TYPES.MISINFORMATION,
  reportContent: string = 'This content violates community guidelines.'
) => {
  await navigation.goToRoom(page, room.name);

  const IdeaDiv = page.getByTestId(`idea-${ideaName}`);
  await expect(IdeaDiv).toBeVisible();

  // Open more options menu
  await page.mouse.move(0, 0); // Clear any tooltips
  await formInteractions.openMoreOption(page, IdeaDiv);

  // Click report button
  await IdeaDiv.getByTestId('report-button').click();

  // Wait for report dialog
  await expect(page.getByTestId(TEST_IDS.REPORT_DIALOG)).toBeVisible();

  // Select report type from dropdown (v2 SelectInput)
  await page.getByTestId('report-form-reason').click();
  await page.getByTestId(`report-form-reason-option-${reportType}`).click();

  // Fill in report content (v2 RichEditor)
  await page.getByTestId('report-form-content').locator('[contenteditable="true"]').fill(reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit');
  // The dialog closes only after the API call resolves — waiting for it to hide
  // is equivalent to waiting for the network request to complete.
  await expect(page.getByTestId(TEST_IDS.REPORT_DIALOG)).toBeHidden();
};

/**
 * Report a comment as inappropriate
 * @param page - User's page
 * @param room - Room containing the idea with comment
 * @param ideaName - Name of the idea containing the comment
 * @param commentText - Text of the comment to report
 * @param reportType - Type of report
 * @param reportContent - Detailed reason for the report
 */
export const reportComment = async (
  page: Page,
  room: types.RoomData,
  ideaName: string,
  commentText: string,
  reportType: string = REPORT_TYPES.MISINFORMATION,
  reportContent: string = 'This comment violates community guidelines.'
) => {
  await navigation.goToWildIdea(page, room.name, ideaName);

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();

  // Open comment options
  await formInteractions.clickButton(page, 'comment-more-options');

  // Click report button in the comment menu
  const comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await comment.getByTestId('report-button').click();

  // Wait for report dialog
  await expect(page.getByTestId(TEST_IDS.REPORT_DIALOG)).toBeVisible();

  // Select report type from dropdown (v2 SelectInput)
  await page.getByTestId('report-form-reason').click();
  await page.getByTestId(`report-form-reason-option-${reportType}`).click();

  // Fill in report content (v2 RichEditor)
  await page.getByTestId('report-form-content').locator('[contenteditable="true"]').fill(reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit');
  await expect(page.getByTestId(TEST_IDS.REPORT_DIALOG)).toBeHidden();
};

/**
 * Check if an idea has been reported (admin view)
 * @param adminPage - Admin's page
 * @param ideaName - Name of the reported idea
 */
export const verifyIdeaReported = async (adminPage: Page, ideaName: string) => {
  await findMessage(adminPage, ideaName);
};

/**
 * Check if a comment has been reported (admin view)
 * @param adminPage - Admin's page
 * @param commentText - Text of the reported comment
 */
export const verifyCommentReported = async (adminPage: Page, commentText: string) => {
  await findMessage(adminPage, commentText);
};

/**
 * Report a bug
 * @param page - User's page
 * @param description - Bug description
 */
export const reportBug = async (page: Page, description: string) => {
  await navigation.goToHome(page);

  // Click report bug option
  await formInteractions.clickButton(page, TEST_IDS.REPORT_BUG_BUTTON);

  // Wait for bug report dialog
  await expect(page.getByTestId(TEST_IDS.BUG_DIALOG)).toBeVisible();

  // Fill in bug description using markdown editor
  await formInteractions.fillMarkdownForm(page, 'content', description);

  // Submit bug report
  await formInteractions.clickButton(page, TEST_IDS.BUG_FORM_SUBMIT);
  await expect(page.getByTestId(TEST_IDS.BUG_DIALOG)).toBeHidden();
};

/**
 * Check if a bug report exists (admin view)
 * @param adminPage - Admin's page
 * @param description - Bug description text
 */
export const verifyBugReported = async (adminPage: Page, description: string) => {
  await findMessage(adminPage, description);
};

/**
 * Search the messages page (freshly loaded, so no earlier search lingers)
 * @param page - Admin's page
 * @param text - Text in the message headline or body
 */
export const searchMessages = async (page: Page, text: string) => {
  await navigation.goToMessages(page);
  await page.getByTestId(TEST_IDS.SEARCH_BUTTON).click();
  await page.getByTestId(TEST_IDS.SEARCH_FIELD).fill(text);
};

/**
 * Expect a messages search to come back empty; an inbox with nothing left in it shows the empty state instead
 * @param page - Page on /messages
 */
export const expectNoMessages = async (page: Page) => {
  await expect(
    page.getByTestId('messages-no-results-state').or(page.getByTestId('messages-empty-state'))
  ).toBeVisible();
};

/**
 * Open the first message matching a text and check its detail shows it
 * @param page - Admin's page
 * @param text - Text in the message headline or body
 */
export const findMessage = async (page: Page, text: string) => {
  await searchMessages(page, text);
  const result = page.getByTestId('message-item').first();
  await expect(result).toBeVisible();
  await result.getByRole('link').click();
  await expect(page.locator('[data-testid^="message-detail-"]')).toContainText(text);
};
