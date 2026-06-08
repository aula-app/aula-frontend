import { expect, Page } from '@playwright/test';

import * as types from '../../support/types';
import * as formInteractions from '../forms';
import * as navigation from '../navigation';
import * as settingsInteractions from '../settings';
import { TIMEOUTS } from '../../support/constants';

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

