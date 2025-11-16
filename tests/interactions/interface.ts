import { expect, Page } from '@playwright/test';

import * as shared from '../support/utils';

export const reportBug = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost());

  const ReportButton = page.locator('[aria-label="Fehler melden"]');
  await expect(ReportButton).toBeVisible();
  await ReportButton.click({ timeout: 1000 });

  await page.locator('div[contenteditable="true"]').fill(reason);
  // submit the report form
  await page.locator('button').filter({ hasText: 'Bestätigen' }).click({ timeout: 1000 });
};

export const checkReport = async (
  page: Page, //
  reason: string
) => {
  await page.goto(shared.getHost() + '/settings/bugs');
  const Report = page.locator('p').filter({ hasText: reason });
  await expect(Report).toHaveCount(1);
};
