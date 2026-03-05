import { expect, Page } from '@playwright/test';
import * as shared from '../support/utils';
import { TIMEOUTS } from '../support/constants';

const host = shared.getHost();

export const clickOnPageItem = async (page: Page, text: string) => {
  const item = page.getByText(text);
  await expect(item).toBeVisible();
  await item.click({ timeout: TIMEOUTS.ONE_SECOND });
  await page.waitForTimeout(10);
  await page.waitForLoadState('networkidle');
};

export const clickOnLink = async (page: Page, path: string) => {
  await page.locator(`a[href="${path}"]`).filter({ visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes(path));
  await page.waitForLoadState('networkidle');
};

export const clickToNavigate = async (page: Page, path: string) => {
  const currentUrl = page.url();
  if (currentUrl === path) {
    return;
  }

  await goToHome(page);
  await clickOnLink(page, path);
};

// Ui elements navigation

export const openAccordion = async (page: Page, testId: string) => {
  const accordion = page.getByTestId(testId);
  await expect(accordion).toBeVisible({ timeout: TIMEOUTS.ONE_SECOND });

  const isExpanded = await accordion.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await accordion.click();
    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
  }
};

// Page navigation

export const goToHome = async (page: Page) => {
  const currentUrl = page.url();
  if (currentUrl === host || currentUrl === `${host}/`) {
    return;
  }

  await page.goto(host, { waitUntil: 'networkidle' });
};

export const goToRoom = async (page: Page, roomName: string) => {
  await goToHome(page);

  await page.getByTestId('room-card').filter({ hasText: roomName, visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes('/room') || url.pathname.includes('/rooms'));
  await page.waitForLoadState('networkidle');
};

export const goToWildIdea = async (page: Page, roomName: string, ideaName: string) => {
  await goToRoom(page, roomName);

  const ideaCard = page.getByTestId(`idea-${ideaName}`);
  await expect(ideaCard).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await ideaCard.click();
  await page.waitForURL((url) => url.pathname.includes('/idea'), { timeout: TIMEOUTS.THREE_SECONDS });
  await page.waitForLoadState('networkidle');
};

export const goToPhase = async (page: Page, roomName: string, phaseNumber: number) => {
  await goToRoom(page, roomName);

  const phaseTab = page.getByTestId(`link-to-phase-${phaseNumber}`);
  await expect(phaseTab).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await phaseTab.click();
  await page.waitForLoadState('networkidle');
};

export const goToMessages = async (page: Page) => {
  await goToHome(page);
  await clickOnLink(page, '/messages');
};

// Settings navigation

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
