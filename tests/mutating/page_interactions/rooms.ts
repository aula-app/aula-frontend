import { expect, Page } from '@playwright/test';

import * as shared from '../../shared';
import { sleep } from '../../utils';
import * as roomFixtures from '../../fixtures/rooms';
import { goToRoomSettings } from './users';

const host = shared.getHost();

export const create = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host);

  await goToRoomSettings(page);

  // use a button to open the modal for adding a room
  const AddRoomButton = page.getByRole('button', { name: 'Neue Raum' });

  await expect(AddRoomButton).toBeVisible();
  await AddRoomButton.click({ timeout: 1000 });

  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });

  // fill in the necessary information
  await page.fill('input[name="room_name"]', room.name);
  await page.locator('div[contenteditable="true"]').fill('generated during automated tests');

  // how to fill in one of those MUI multiselectors:

  const UserSelector = page.locator('[data-testing-id="usersfield"] input');
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

  // ensure the room exists by filtering the admin list for the name

  await page.goto(host + '/settings/rooms');

  // open the filter menu:
  const FilterButton = page.locator('[aria-label="button-open-filters"]');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-select-1').click({ timeout: 1000 });
  await page.getByRole('option', { name: 'Raum Name' }).click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-select-2', room.name);

  // find the new user in the user table
  const row = page.getByText(room.name, { exact: true });

  // make sure that row actually exists
  await expect(row).toBeVisible();
};

export const remove = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host);

  await goToRoomSettings(page);

  // open the filter menu:
  const FilterButton = page.locator('[aria-label="button-open-filters"]');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-select-1').click({ timeout: 1000 });
  await page.getByRole('option', { name: 'Raum Name' }).click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-select-2', room.name);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: room.name });

  // make sure that row actually exists
  await expect(row).toHaveCount(1, { timeout: 1000 });

  const DeleteCheckbox = row.locator('input[type="checkbox"]');
  await expect(DeleteCheckbox).toBeVisible({ timeout: 1000 });
  DeleteCheckbox.click({ timeout: 1000 });

  // press delete button
  const DeleteButton = page.getByRole('button', { name: 'Räume entfernen' });
  await expect(DeleteButton).toBeVisible({ timeout: 1000 });
  await DeleteButton.click({ timeout: 1000 });

  const Dialog = page.getByRole('dialog');
  await expect(Dialog).toBeVisible({ timeout: 3000 });

  const ConfirmButton = Dialog.getByRole('button', { name: 'Löschen' });
  await expect(ConfirmButton).toBeVisible({ timeout: 3000 });
  await ConfirmButton.click({ timeout: 1000 });
};
