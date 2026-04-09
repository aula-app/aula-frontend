import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';
import * as shared from '../support/utils';

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
  if (currentUrl === `${host}${path}`) {
    return;
  }
  await page.goto(`${host}${path}`, { waitUntil: 'domcontentloaded' });
};

// Ui elements navigation

export const openAccordion = async (page: Page, testId: string) => {
  await page.waitForLoadState('domcontentloaded');
  const accordion = page.getByTestId(testId);
  await expect(accordion).toBeVisible();

  const isExpanded = await accordion.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await accordion.click();
    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
  }
};

// Page navigation

/**
 * Refreshes the JWT in the page's localStorage by calling the backend refresh endpoint.
 * Necessary when the stored JWT pre-dates room membership changes made in a test's beforeAll,
 * because the server uses JWT room roles to authorise getIdeasByRoom but doesn't trigger
 * an automatic refresh for that endpoint when the JWT is valid-but-stale.
 */
const refreshJWT = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    const apiUrl = localStorage.getItem('api_url');
    const code = localStorage.getItem('code');
    const token = localStorage.getItem('token');
    if (!apiUrl || !code || !token) return;
    try {
      const response = await fetch(`${apiUrl}/api/controllers/refresh_token.php`, {
        method: 'GET',
        headers: {
          'aula-instance-code': code,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && data.JWT) {
        localStorage.setItem('token', data.JWT);
      }
    } catch {
      // Ignore errors — stale JWT is better than a crash
    }
  });
};

export const goToHome = async (page: Page) => {
  // Always navigate (no early-return for "already at host") so the SPA fetches
  // a fresh room list. Without this, a stale home page loaded before another
  // worker created a room never shows that room's card.
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#rooms-heading')).toBeVisible();
};

export const goToRoom = async (page: Page, roomName: string) => {
  await goToHome(page);
  // Refresh the JWT so room memberships added after the stored token was issued
  // are visible to the server when fetchIdeas() is called on the room page.
  await refreshJWT(page);
  // Explicit waitFor gives a clearer timeout error when the target room never appears.
  await page.getByTestId(TEST_IDS.ROOM_CARD).filter({ hasText: roomName }).first().waitFor({ state: 'visible' });
  await page.getByTestId(TEST_IDS.ROOM_CARD).filter({ hasText: roomName, visible: true }).click();
  await page.waitForURL((url) => url.pathname.includes('/room') || url.pathname.includes('/rooms'));
};

export const goToWildIdea = async (page: Page, roomName: string, ideaName: string) => {
  await goToRoom(page, roomName);

  // Explicitly wait for the idea to be visible: fetchIdeas() completes asynchronously after
  // goToRoom resolves, so the idea card may not exist yet when we arrive on the room page.
  const idea = page.getByTestId(`idea-${ideaName}`);
  await idea.waitFor({ state: 'visible' });
  await idea.click();
  await page.waitForURL((url) => url.pathname.includes('/idea'));
};

export const goToPhase = async (page: Page, roomName: string, phaseNumber: number) => {
  await goToRoom(page, roomName);

  // Wait for the phase link to be visible (room page renders after fetchIdeas completes)
  const phaseLink = page.getByTestId(`link-to-phase-${phaseNumber}`);
  await phaseLink.waitFor({ state: 'visible' });
  await phaseLink.click();
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
