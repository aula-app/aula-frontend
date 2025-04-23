import { expect, Page } from '@playwright/test';

import * as shared from '../../shared';
import { sleep } from '../../utils';
import * as roomFixtures from '../../fixtures/rooms';

const host = shared.getHost();

export const create = async (page: Page, room: roomFixtures.RoomData) => {
  // start at home
  await page.goto(host);

  // use the menu to navigate to the rooms admin page
  const RoomsMenuItem = page.locator('a[href="/settings/rooms"]');
  await expect(RoomsMenuItem).toBeVisible();
  await RoomsMenuItem.click();

  // use a button to open the modal for adding a room
  const AddRoomButton = page.getByRole('button', { name: 'Raum hinzufügen' });
  await expect(AddRoomButton).toBeVisible();
  await AddRoomButton.click();

  await page.waitForSelector('input[name="room_name"]', { state: 'visible', timeout: 500 });

  // fill in the necessary information
  await page.fill('input[name="room_name"]', room.name);
  await page.locator('div[contenteditable="true"]').fill('generated during automated tests');

  // how to fill in one of those MUI multiselectors:

  const UserSelector = page.locator('[data-testing-id="usersfield"] input');
  await expect(UserSelector).toBeVisible({ timeout: 500 });

  await UserSelector.click();

  // click and add each desired user to the room
  for (const u of room.users) {
    console.info(u);
    await page.getByRole('option', { name: u.displayName }).click();
    await UserSelector.click();
  }

  // submit the room form
  await page.locator('button[type="submit"]').click();

  // OMG
  await sleep(3);

  // ensure the room exists by filtering the admin list for the name

  await page.goto(host + '/settings/rooms');

  // open the filter menu:
  const FilterButton = page.locator('[aria-label="button-open-filters"]');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click();

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-select-1').click();
  await page.getByRole('option', { name: 'Raum Name' }).click();

  // filter by our user name
  await page.fill('#filter-select-2', room.name);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: room.name });

  // make sure that row actually exists
  await expect(row).toHaveCount(1, { timeout: 500 });
};
