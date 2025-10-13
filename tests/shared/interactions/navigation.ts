import { expect, Page } from '@playwright/test';
import * as shared from '../shared';
import { RoomPhases } from '../../../src/types/SettingsTypes';

const host = shared.getHost();

export const checkUrl = async (page: Page, path: string) => {
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
  await page.waitForLoadState('networkidle');
};

export const openAccordion = async (page: Page, testId: string) => {
  const accordion = page.getByTestId(testId);
  await expect(accordion).toBeVisible({ timeout: 10000 });

  const isExpanded = await accordion.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await accordion.click();
    await page.waitForTimeout(500);
  }
};

export const closeAccordion = async (page: Page, testId: string) => {
  const accordion = page.getByTestId(testId);
  await expect(accordion).toBeVisible({ timeout: 10000 });

  const isExpanded = await accordion.getAttribute('aria-expanded');
  if (isExpanded === 'true') {
    await accordion.click();
    await page.waitForTimeout(1000);
  }
};

// Main navigation

export const clickOnPageItem = async (page: Page, itemText: string) => {
  const itemDiv = page.getByText(itemText);
  await expect(itemDiv).toBeVisible();
  await itemDiv.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
};

export const clickOnPageId = async (page: Page, itemId: string) => {
  const itemDiv = page.getByTestId(itemId);
  await expect(itemDiv).toBeVisible();
  await itemDiv.click();
  await page.waitForLoadState('networkidle');
};

export const goToRoom = async (page: Page, roomName: string) => {
  await goToHome(page);
  await clickOnPageItem(page, roomName);
};

export const goToWildIdea = async (page: Page, roomName: string, ideaName: string) => {
  await goToRoom(page, roomName);
  await clickOnPageItem(page, ideaName);
};

export const goToPhase = async (page: Page, roomName: string, phase: RoomPhases) => {
  await goToRoom(page, roomName);
  await clickOnPageId(page, `link-to-phase-${phase}`);
};

// Sidebar navigation

export const goToHome = async (page: Page) => {
  await page.goto(host);
  await page.waitForLoadState('networkidle');
};

export const goToProfile = async (page: Page) => {
  await clickToNavigate(page, '/settings/profile');
};

export const goToMessages = async (page: Page) => {
  await clickToNavigate(page, '/messages');
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
