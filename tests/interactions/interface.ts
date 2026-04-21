import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';

import * as shared from '../support/utils';

export const reportBug = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost());

  await expect(page.getByTestId(TEST_IDS.REPORT_BUG_BUTTON)).toBeVisible();
  await page.getByTestId(TEST_IDS.REPORT_BUG_BUTTON).click();

  // The bug form uses a MarkdownEditor with name="content", so the container
  // testId is markdown-editor-content. The contenteditable is third-party (MDXEditor).
  await page.getByTestId('markdown-editor-content').locator('[contenteditable="true"]').fill(reason);

  await page.getByTestId(TEST_IDS.BUG_FORM_SUBMIT).click();
};

export const checkReport = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost() + '/settings/bugs');
  const Report = page.locator('p').filter({ hasText: reason });
  await expect(Report).toHaveCount(1);
};
