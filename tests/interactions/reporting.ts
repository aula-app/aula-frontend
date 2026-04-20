import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';
import * as settingsInteractions from './settings';

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

  // Select report type from dropdown
  await formInteractions.selectOptionByValue(page, 'select-field-report', reportType);

  // Fill in report content
  await formInteractions.fillMarkdownForm(page, 'content', reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit-button');
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

  // Select report type from dropdown
  await formInteractions.selectOptionByValue(page, 'select-field-report', reportType);

  // Fill in report content
  await formInteractions.fillMarkdownForm(page, 'content', reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit-button');
  await expect(page.getByTestId(TEST_IDS.REPORT_DIALOG)).toBeHidden();
};

/**
 * Check if an idea has been reported (admin view)
 * @param adminPage - Admin's page
 * @param ideaName - Name of the reported idea
 */
export const verifyIdeaReported = async (adminPage: Page, ideaName: string) => {
  await navigation.goToReportsSettings(adminPage);

  // Apply filter to find the specific report by body (idea name appears in the body/location)
  await settingsInteractions.applyFilter(adminPage, { option: 'body', value: ideaName });

  // Wait for the page to show filtered results - look for the idea name anywhere on the page
  await expect(adminPage.locator('text=' + ideaName).first()).toBeVisible();
};

/**
 * Check if a comment has been reported (admin view)
 * @param adminPage - Admin's page
 * @param commentText - Text of the reported comment
 */
export const verifyCommentReported = async (adminPage: Page, commentText: string) => {
  await navigation.goToReportsSettings(adminPage);

  // Apply filter to find the specific report by body text
  await settingsInteractions.applyFilter(adminPage, { option: 'body', value: commentText });

  // Wait for the page to show filtered results - look for the comment text anywhere on the page
  await expect(adminPage.locator('text=' + commentText).first()).toBeVisible();
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
  await navigation.goToBugsSettings(adminPage);

  // Apply filter to find the specific bug report by body text
  await settingsInteractions.applyFilter(adminPage, { option: 'body', value: description });

  // Wait for the page to show filtered results - look for the description anywhere on the page
  await expect(adminPage.locator('text=' + description).first()).toBeVisible();
};
