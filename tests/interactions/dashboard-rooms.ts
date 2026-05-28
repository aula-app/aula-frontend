import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';
import * as navigation from './navigation';

// Search and Sort interactions for Rooms View (Home Page / Dashboard)

export const openSearch = async (page: Page) => {
  await page.getByTestId(TEST_IDS.SEARCH_BUTTON).filter({ visible: true }).click();
  const searchField = page.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
  await expect(searchField).toBeVisible();
};

export const closeSearch = async (page: Page) => {
  await page.getByTestId(TEST_IDS.SEARCH_BUTTON).filter({ visible: true }).click();
  const searchField = page.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
  await expect(searchField).not.toBeVisible();
};

export const searchRooms = async (page: Page, query: string) => {
  const searchField = page.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');

  // Open search if not already open
  const isVisible = await searchField.isVisible().catch(() => false);
  if (!isVisible) {
    await openSearch(page);
  }

  await searchField.fill(query);
  // Wait for the rooms list to re-fetch after filling the search filter.
  await page.waitForLoadState('networkidle');
};

export const clearSearch = async (page: Page) => {
  const searchField = page.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
  await searchField.clear();
  // Wait for the rooms list to re-fetch after clearing the search filter.
  await page.waitForLoadState('networkidle');
};

// this function only opens the sort menu, but doesn't click on the dropdown
export const openSortMenu = async (page: Page) => {
  const sortSelect = page.getByTestId(TEST_IDS.SORT_SELECT);
  if (!(await sortSelect.isVisible())) {
    await page.getByTestId(TEST_IDS.SORT_BUTTON).filter({ visible: true }).click();
    expect(sortSelect).toBeVisible();
  }
};

export const closeSortMenu = async (page: Page) => {
  await page.getByTestId(TEST_IDS.SORT_BUTTON).filter({ visible: true }).click();
  const sortSelect = page.getByTestId(TEST_IDS.SORT_SELECT);
  await expect(sortSelect).not.toBeVisible();
};

// this function also opens the dropdown
export const selectSortOption = async (page: Page, sortValue: string) => {
  await page.getByTestId(TEST_IDS.SORT_SELECT).filter({ visible: true }).click();
  await page.getByTestId(`sort-option-${sortValue}`).filter({ visible: true }).click();
};

export const toggleSortDirection = async (page: Page) =>
  await page.getByTestId(TEST_IDS.SORT_DIRECTION_BUTTON).filter({ visible: true }).click();

export const getCountOfRoomsDisplayed = async (page: Page): Promise<number> => {
  const roomCards = page.getByTestId(TEST_IDS.ROOM_CARD);
  // Rooms load asynchronously after the heading appears — poll until the count stabilizes.
  let lastCount = -1;
  for (let i = 0; i < 5; i++) {
    const count = await roomCards.count();
    if (count === lastCount) break;
    lastCount = count;
    await page.waitForTimeout(i * 50);
  }
  return lastCount < 0 ? 0 : lastCount;
};

export const getFirstRoomName = async (page: Page): Promise<string | null> => {
  const namesOfRooms = page.getByTestId(TEST_IDS.ROOM_CARD).filter({ visible: true }).locator(page.locator('h3'));
  return await namesOfRooms.first().textContent();
};
