import { expect, Page } from '@playwright/test';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';
import * as settingsInteractions from './settings';

export const create = async (page: Page, room: types.RoomData) => {
  await navigation.goToRoomsSettings(page);

  await page.waitForSelector('[data-testid="add-rooms-button"]', { state: 'visible', timeout: 500 });
  await formInteractions.clickButton(page, 'add-rooms-button');
  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });
  await formInteractions.fillForm(page, 'room-name', room.name);
  await formInteractions.fillMarkdownForm(page, 'description_public', room.description);

  const UserSelector = page.getByTestId('users-field');
  await expect(UserSelector).toBeVisible();

  for (const u of room.users) {
    await UserSelector.locator('.MuiAutocomplete-popupIndicator').click();
    const currentUser = page.getByTestId(`select-option-${u.username}`);
    await expect(currentUser).toBeVisible();
    await currentUser.click();
  }

  await formInteractions.clickButton(page, 'room-form-submit-button');

  await page.waitForLoadState('networkidle');

  await navigation.goToRoomsSettings(page);
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
  const searchButton = page.getByTestId('search-button');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  await page.waitForTimeout(400); // Wait for collapse animation
};

export const closeSearch = async (page: Page) => {
  const searchButton = page.getByTestId('search-button');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  await page.waitForTimeout(400);
};

export const searchRooms = async (page: Page, query: string) => {
  const searchField = page.getByTestId('search-field').locator('input');

  // Open search if not already open
  const isVisible = await searchField.isVisible().catch(() => false);
  if (!isVisible) {
    await openSearch(page);
  }

  await searchField.fill(query);
  await page.waitForTimeout(500); // Wait for search to filter results
};

export const clearSearch = async (page: Page) => {
  const searchField = page.getByTestId('search-field').locator('input');
  await searchField.clear();
  await page.waitForTimeout(500);
};

export const openSort = async (page: Page) => {
  await navigation.goToHome(page);
  const sortButton = page.getByTestId('sort-button');
  await expect(sortButton).toBeVisible();
  await sortButton.click();
  await page.waitForTimeout(400);
};

export const closeSort = async (page: Page) => {
  const sortButton = page.getByTestId('sort-button');
  await expect(sortButton).toBeVisible();
  await sortButton.click();
  await page.waitForTimeout(400);
};

export const selectSortOption = async (page: Page, sortValue: string) => {
  const sortSelect = page.getByTestId('sort-select');
  await expect(sortSelect).toBeVisible();
  await sortSelect.click();

  const sortOption = page.getByTestId(`sort-option-${sortValue}`);
  await expect(sortOption).toBeVisible();
  await sortOption.click();
  await page.waitForTimeout(500);
};

export const toggleSortDirection = async (page: Page) => {
  const sortDirectionButton = page.getByTestId('sort-direction-button');
  await expect(sortDirectionButton).toBeVisible();
  await sortDirectionButton.click();
  await page.waitForTimeout(300); // Wait for debounce
};

export const getRoomCount = async (page: Page): Promise<number> => {
  await navigation.goToHome(page);
  const roomCards = page.getByTestId('room-card');

  // Wait for at least one room card to be present or timeout
  // This ensures the page has finished loading rooms before counting
  await roomCards.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
    // If no rooms exist, that's ok - count will be 0
  });

  return await roomCards.count();
};

export const getFirstRoomName = async (page: Page): Promise<string | null> => {
  await navigation.goToHome(page);
  const firstRoom = page.getByTestId('room-card').first();
  const isVisible = await firstRoom.isVisible().catch(() => false);
  if (!isVisible) return null;

  return await firstRoom.textContent();
};
