import { expect, Page } from '@playwright/test';

import * as shared from '../shared';
import * as navigation from './navigation';
import * as formInteractions from './forms';
import * as settingsInteractions from './settings';
import { sleep } from '../utils';
import * as roomFixtures from '../../fixtures/rooms';

const host = shared.getHost();

export const create = async (page: Page, room: roomFixtures.RoomData) => {
  await navigation.goToRoomsSettings(page);

  const AddRoomButton = page.getByTestId('add-rooms-button');
  await expect(AddRoomButton).toBeVisible();
  await AddRoomButton.click();

  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });
  await formInteractions.fillForm(page, 'room-name-input', room.name);
  await page.locator('div[contenteditable="true"]').fill(room.description);

  const UserSelector = page.getByTestId('users-field');
  await expect(UserSelector).toBeVisible();

  for (const u of room.users) {
    await UserSelector.locator('.MuiAutocomplete-popupIndicator').click();
    const currentUser = page.getByTestId(`user-option-${u.username}`);
    await expect(currentUser).toBeVisible();
    await currentUser.click();
  }

  formInteractions.clickButton(page, 'room-form-submit-button');

  // OMG
  await sleep(3);
  await page.waitForLoadState('networkidle');

  await navigation.goToRoomsSettings(page);
  await expect(page.getByTestId('add-rooms-button')).toBeVisible();
  await settingsInteractions.addFilter(page, 'room_name', room.name);
  await settingsInteractions.clearFilter(page);
};

export const remove = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host || 'http://localhost:3000');

  await navigation.goToRoomsSettings(page);

  // open the filter menu:
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

  // select "room name" from the "filter by" dropdown

  await page.locator('#filter-field-select').click({ timeout: 1000 });
  await page.locator('li[data-value="room_name"]').click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-value-input', room.name);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: room.name });

  // make sure that row actually exists
  await expect(row).toHaveCount(1);

  const DeleteCheckbox = row.locator('input[type="checkbox"]');
  await expect(DeleteCheckbox).toBeVisible();
  DeleteCheckbox.click({ timeout: 1000 });

  // press delete button
  const DeleteButton = page.locator('[data-testid="remove-rooms-button"]');
  await expect(DeleteButton).toBeVisible();
  await DeleteButton.click({ timeout: 1000 });

  const Dialog = page.getByRole('dialog');
  await expect(Dialog).toBeVisible();

  const ConfirmButton = Dialog.locator('[data-testid="confirm-delete-rooms-button"]');
  await expect(ConfirmButton).toBeVisible();
  await ConfirmButton.click({ timeout: 1000 });
};

export const goToRoom = async (page: Page, roomName: string) => {
  await navigation.goToHome(page);

  const RoomDiv = page.getByText(roomName, { exact: true });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();
  await page.waitForLoadState('networkidle');
};
