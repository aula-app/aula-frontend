import { Page, expect } from '@playwright/test';

export const fillForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const clickButton = async (page: Page, testId: string) => {
  const button = page.getByTestId(testId);
  await expect(button).toBeVisible();
  await button.click();
};
