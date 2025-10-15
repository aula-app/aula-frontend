import { expect, Page } from '@playwright/test';
import * as shared from '../shared';

const host = shared.getHost();

export const clickToNavigate = async (page: Page, path: string) => {
  const currentUrl = page.url();
  if (currentUrl.includes(path)) {
    return;
  }

  await goToHome(page);

  const button = page.locator(`a[href="${path}"]`);
  await expect(button).toBeVisible();
  await button.click({ timeout: 1000 });
  await page.waitForURL((url) => url.pathname.includes(path), { timeout: 5000 });
  await page.waitForLoadState('networkidle');
};

export const openAccordion = async (page: Page, testId: string) => {
  const accordion = page.getByTestId(testId);
  await expect(accordion).toBeVisible({ timeout: 10000 });
  await accordion.click();
  await page.waitForTimeout(1000);
};

// Sidebar navigation

export const goToHome = async (page: Page) => {
  await page.goto(host);
  await page.waitForLoadState('networkidle');
};

export const goToProfile = async (page: Page) => {
  await clickToNavigate(page, '/settings/profile');
};

export const goToSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/configuration');
};

export const goToUsersSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/users');
};

export const goToRoomsSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/rooms');
};

export const goToBoxesSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/boxes');
};

export const goToIdeasSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/ideas');
};

export const goToMessagesSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/messages');
};

export const goToAnnouncementsSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/announcements');
};

export const goToReportsSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/reports');
};

export const goToBugsSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/bugs');
};

export const goToRequestsSettings = async (page: Page) => {
  await clickToNavigate(page, '/settings/requests');
};
