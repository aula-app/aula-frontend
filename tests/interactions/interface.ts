import { expect, Page } from '@playwright/test';

import * as shared from '../support/utils';
import { TIMEOUTS } from '../support/constants';

export const reportBug = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost());

  const ReportButton = page.locator('[aria-label="Fehler melden"]');
  await expect(ReportButton).toBeVisible();
  await ReportButton.click({ timeout: TIMEOUTS.ONE_SECOND });

  await page.locator('div[contenteditable="true"]').fill(reason);
  // submit the report form
  await page.locator('button').filter({ hasText: 'Bestätigen' }).click({ timeout: TIMEOUTS.ONE_SECOND });
};

export const checkReport = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost() + '/settings/bugs');
  const Report = page.locator('p').filter({ hasText: reason });
  await expect(Report).toHaveCount(1);
};
