import { expect, Page } from '@playwright/test';
import * as shared from '../support/utils';
import { TIMEOUTS } from '../support/constants';

const host = shared.getHost();

export const clickOnPageItem = async (page: Page, text: string) => {
  const item = page.getByText(text);
  await expect(item).toBeVisible();
  await item.click();
};

export const clickOnLink = async (page: Page, path: string) => {
  await page.locator(`a[href="${path}"]`).filter({ visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes(path));
};

export const clickToNavigate = async (page: Page, path: string) => {
  const currentUrl = page.url();
  if (currentUrl.includes(path)) {
    return;
  }
  await page.goto(`${host}${path}`, { waitUntil: 'domcontentloaded' });
};

// Ui elements navigation

export const openAccordion = async (page: Page, testId: string) => {
  await page.waitForLoadState('domcontentloaded');
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

  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#rooms-heading')).toBeVisible();
};

export const goToRoom = async (page: Page, roomName: string) => {
  await goToHome(page);
  // Wait for the specific room card — avoids races where any card appears before the target room loads
  await page.getByTestId('room-card').filter({ hasText: roomName }).first().waitFor({ state: 'visible' });
  await page.getByTestId('room-card').filter({ hasText: roomName, visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes('/room') || url.pathname.includes('/rooms'));
};

export const goToWildIdea = async (page: Page, roomName: string, ideaName: string) => {
  await goToRoom(page, roomName);

  await page.getByTestId(`idea-${ideaName}`).filter({ visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes('/idea'), { timeout: TIMEOUTS.THREE_SECONDS });
};

export const goToPhase = async (page: Page, roomName: string, phaseNumber: number) => {
  await goToRoom(page, roomName);

  await page.getByTestId(`link-to-phase-${phaseNumber}`).filter({ visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes(`phase`));
};

export const goToMessages = async (page: Page) => {
  await page.goto(`${host}/messages`, { waitUntil: 'domcontentloaded' });
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
