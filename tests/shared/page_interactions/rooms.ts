import { expect, Page } from '@playwright/test';

import * as shared from '../shared';
import { sleep } from '../utils';
import * as roomFixtures from '../../fixtures/rooms';
import { goToRoomSettings } from './users';

const host = shared.getHost();

export const create = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host || 'http://localhost:3000');

  await goToRoomSettings(page);

  // use a button to open the modal for adding a room
  const AddRoomButton = page.locator('[data-testid="add-rooms-button"]');

  await expect(AddRoomButton).toBeVisible();
  await AddRoomButton.click({ timeout: 1000 });

  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });

  // fill in the necessary information
  await page.fill('input[name="room_name"]', room.name);
  await page.locator('div[contenteditable="true"]').fill('generated during automated tests');

  // how to fill in one of those MUI multiselectors:

  const UserSelector = page.locator('[data-testid="usersfield"] input');
  await expect(UserSelector).toBeVisible({ timeout: 500 });

  await UserSelector.click({ timeout: 1000 });

  // click and add each desired user to the room
  for (const u of room.users) {
    await page.getByRole('option', { name: u.displayName }).click({ timeout: 1000 });
    await UserSelector.click({ timeout: 1000 });
  }

  // submit the room form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  // OMG
  await sleep(3);
  await page.waitForLoadState('networkidle');

  // ensure the room exists by filtering the admin list for the name

  await page.goto(host + '/settings/rooms');

  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  // Wait for the rooms table/content to load first
  await expect(page.locator('#rooms-heading')).toBeVisible();

  // open the filter menu:
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible({ timeout: 10000 });
  await FilterButton.click({ timeout: 1000 });

  // select "room name" from the "filter by" dropdown
  await page.locator('#filter-field-select').click({ timeout: 1000 });
  await page.locator('li[data-value="room_name"]').click({ timeout: 1000 });

  // filter by our room name
  await page.fill('#filter-value-input', room.name);

  // find the new room in the room table
  const row = page.getByText(room.name, { exact: true }).first();

  // make sure that row actually exists
  await expect(row).toBeVisible();
};

export const remove = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host || 'http://localhost:3000');

  await goToRoomSettings(page);

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

  const ConfirmButton = Dialog.locator('button[color="error"]');
  await expect(ConfirmButton).toBeVisible();
  await ConfirmButton.click({ timeout: 1000 });
};
