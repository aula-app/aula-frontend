import { expect, Page } from '@playwright/test';

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
  await IdeaDiv.getByTestId('report-button').click({ timeout: 1000 });

  // Wait for report dialog
  await page.getByTestId('report-dialog').waitFor({ state: 'visible', timeout: 1000 });

  // Select report type from dropdown
  await formInteractions.selectOptionByValue(page, 'select-field-report', reportType);

  // Fill in report content
  await formInteractions.fillMarkdownForm(page, 'content', reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit-button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
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
  await comment.getByTestId('report-button').click({ timeout: 1000 });

  // Wait for report dialog
  await page.waitForSelector('[data-testid="report-dialog"]', { state: 'visible', timeout: 1000 });

  // Select report type from dropdown
  await formInteractions.selectOptionByValue(page, 'select-field-report', reportType);

  // Fill in report content
  await formInteractions.fillMarkdownForm(page, 'content', reportContent);

  // Submit report
  await formInteractions.clickButton(page, 'report-form-submit-button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
};

/**
 * Check if an idea has been reported (admin view)
 * @param adminPage - Admin's page
 * @param ideaName - Name of the reported idea
 */
export const verifyIdeaReported = async (adminPage: Page, ideaName: string) => {
  await navigation.goToReportsSettings(adminPage);

  const ReportedIdea = adminPage.getByText(ideaName);
  await expect(ReportedIdea).toBeVisible({ timeout: 5000 });
};

/**
 * Check if a comment has been reported (admin view)
 * @param adminPage - Admin's page
 * @param commentText - Text of the reported comment
 */
export const verifyCommentReported = async (adminPage: Page, commentText: string) => {
  await navigation.goToReportsSettings(adminPage);

  const ReportedComment = adminPage.getByText(commentText);
  await expect(ReportedComment).toBeVisible({ timeout: 5000 });
};

/**
 * Report a bug
 * @param page - User's page
 * @param description - Bug description
 */
export const reportBug = async (page: Page, description: string) => {
  await navigation.goToHome(page);

  // Click report bug option
  await formInteractions.clickButton(page, 'report-bug-button');

  // Wait for bug report dialog
  await page.getByTestId('bug-dialog').waitFor({ state: 'visible', timeout: 1000 });

  // Fill in bug description using markdown editor
  await formInteractions.fillMarkdownForm(page, 'content', description);

  // Submit bug report
  await formInteractions.clickButton(page, 'bug-form-submit-button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
};

/**
 * Check if a bug report exists (admin view)
 * @param adminPage - Admin's page
 * @param description - Bug description text
 */
export const verifyBugReported = async (adminPage: Page, description: string) => {
  await navigation.goToBugsSettings(adminPage);

  const BugReport = adminPage.getByText(description);
  await expect(BugReport).toBeVisible({ timeout: 5000 });
};
