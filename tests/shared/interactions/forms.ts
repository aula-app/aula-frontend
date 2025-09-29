import { Locator, Page, expect } from '@playwright/test';

export const fillForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(testId);
  await field.clear();
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const clickButton = async (page: Page, testId: string) => {
  const button = page.getByTestId(testId);
  await expect(button).toBeVisible({ timeout: 5000 });
  await button.click({ timeout: 5000 });
};

export const openMoreOption = async (page: Page, parent: Locator) => {
  const moreButton = parent.getByTestId('idea-more-menu');
  await expect(moreButton).toBeVisible();
  await moreButton.click({ timeout: 1000 });
  await page.waitForTimeout(500);
};
