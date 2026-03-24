import { expect, Page } from '@playwright/test';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';
import * as settingsInteractions from './settings';
import { TIMEOUTS } from '../support/constants';

export const create = async (page: Page, room: types.RoomData) => {
  await navigation.goToRoomsSettings(page);

  await formInteractions.clickButton(page, 'add-rooms-button');
  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: TIMEOUTS.HALF_SECOND });
  await formInteractions.fillForm(page, 'room-name', room.name);
  await formInteractions.fillMarkdownForm(page, 'description_public', room.description);

  const UserSelector = page.getByTestId('users-field');
  await expect(UserSelector).toBeVisible();

  for (const u of room.users) {
    await UserSelector.locator('.MuiAutocomplete-popupIndicator').click();
    await page.getByTestId(`select-option-${u.username}`).filter({ visible: true }).click();
    await page.getByTestId(`select-option-${u.username}`).waitFor({ state: 'hidden' });
  }

  await formInteractions.clickButton(page, 'room-form-submit-button');
  // Wait for form close AND server confirmation (form closes optimistically before API responds)
  await page.waitForSelector('input[name="room_name"]', { state: 'hidden' });
  await page.waitForLoadState('networkidle');

  await expect(page.getByTestId('add-rooms-button')).toBeVisible();
  await settingsInteractions.filter(page, { option: 'room_name', value: room.name });
  await settingsInteractions.clearFilter(page);
};

export const remove = async (page: Page, room: types.RoomData) => {
  await navigation.goToRoomsSettings(page);

  await settingsInteractions.remove({ page, scope: 'rooms', filters: { option: 'room_name', value: room.name } });
};

// Search and Sort interactions for Rooms View (Home Page)

export const openSearch = async (page: Page) => {
  await navigation.goToHome(page);
  await page.getByTestId('search-button').filter({ visible: true }).click();
  const searchField = page.getByTestId('search-field').locator('input');
  await expect(searchField).toBeVisible();
};

export const closeSearch = async (page: Page) => {
  await page.getByTestId('search-button').filter({ visible: true }).click();
  const searchField = page.getByTestId('search-field').locator('input');
  await expect(searchField).not.toBeVisible();
};

export const searchRooms = async (page: Page, query: string) => {
  const searchField = page.getByTestId('search-field').locator('input');

  // Open search if not already open
  const isVisible = await searchField.isVisible().catch(() => false);
  if (!isVisible) {
    await openSearch(page);
  }

  await searchField.fill(query);
};

export const clearSearch = async (page: Page) => {
  const searchField = page.getByTestId('search-field').locator('input');
  await searchField.clear();
  // Wait for the rooms list to re-fetch after clearing the search filter.
  await page.waitForLoadState('networkidle');
};

export const openSort = async (page: Page) => {
  await navigation.goToHome(page);

  const sortSelect = page.getByTestId('sort-select');
  if (!(await sortSelect.isVisible())) {
    await page.getByTestId('sort-button').filter({ visible: true }).click();
    expect(sortSelect).toBeVisible();
  }
};

export const closeSort = async (page: Page) => {
  await page.getByTestId('sort-button').filter({ visible: true }).click();
  const sortSelect = page.getByTestId('sort-select');
  await expect(sortSelect).not.toBeVisible();
};

export const selectSortOption = async (page: Page, sortValue: string) => {
  await page.getByTestId('sort-select').filter({ visible: true }).click();
  await page.getByTestId(`sort-option-${sortValue}`).filter({ visible: true }).click();
};

export const toggleSortDirection = async (page: Page) =>
  await page.getByTestId('sort-direction-button').filter({ visible: true }).click();

export const getRoomCount = async (page: Page): Promise<number> => {
  await navigation.goToHome(page);

  const roomCards = page.getByTestId('room-card');
  // Rooms load asynchronously after the heading appears — poll until the count stabilizes.
  let lastCount = -1;
  for (let i = 0; i < 10; i++) {
    const count = await roomCards.count();
    if (count === lastCount) break;
    lastCount = count;
    await page.waitForTimeout(150);
  }
  return lastCount < 0 ? 0 : lastCount;
};

export const getFirstRoomName = async (page: Page): Promise<string | null> => {
  await navigation.goToHome(page);
  const namesOfRooms = page.getByTestId('room-card').filter({ visible: true }).locator(page.locator('h3'));
  return await namesOfRooms.first().textContent();
};
