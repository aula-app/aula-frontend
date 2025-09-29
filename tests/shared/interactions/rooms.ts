import { expect, Page } from '@playwright/test';

import * as types from '../../fixtures/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';
import * as settingsInteractions from './settings';

export const create = async (page: Page, room: types.RoomData) => {
  await navigation.goToRoomsSettings(page);

  await page.waitForSelector('[data-testid="add-rooms-button"]', { state: 'visible', timeout: 500 });
  await formInteractions.clickButton(page, 'add-rooms-button');
  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });
  await formInteractions.fillForm(page, 'room-name-input', room.name);
  await page
    .getByTestId('markdown-editor-description_public')
    .locator('[contenteditable="true"]')
    .fill(room.description);

  const UserSelector = page.getByTestId('users-field');
  await expect(UserSelector).toBeVisible();

  for (const u of room.users) {
    await UserSelector.locator('.MuiAutocomplete-popupIndicator').click();
    const currentUser = page.getByTestId(`user-option-${u.username}`);
    await expect(currentUser).toBeVisible();
    await currentUser.click();
  }

  await formInteractions.clickButton(page, 'room-form-submit-button');

  await page.waitForLoadState('networkidle');

  await navigation.goToRoomsSettings(page);
  await expect(page.getByTestId('add-rooms-button')).toBeVisible();
  await settingsInteractions.addFilter({ page, filter: { option: 'room_name', value: room.name } });
  await settingsInteractions.clearFilter(page);
};

export const remove = async (page: Page, room: types.RoomData) => {
  await navigation.goToRoomsSettings(page);

  await settingsInteractions.remove({ page, scope: 'rooms', filter: { option: 'room_name', value: room.name } });
};
