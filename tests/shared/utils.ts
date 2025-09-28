import { expect, Page } from '@playwright/test';
import * as shared from './shared';

export const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export const checkUrl = async (page: Page, path: string) => {
  const host = shared.getHost();
  const currentUrl = page.url();
  if (!currentUrl.includes(path)) {
    await page.goto(host);
  }
};

export const clickToNavigate = async (page: Page, path: string) => {
  await checkUrl(page, path);

  const button = page.locator(`a[href="${path}"]`);
  await expect(button).toBeVisible();
  await button.click({ timeout: 1000 });
  await page.waitForURL((url) => url.pathname.includes(path), { timeout: 5000 });
};
