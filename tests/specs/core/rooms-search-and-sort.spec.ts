import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as roomsSettings from '../../interactions/admin-settings/rooms';
import * as navigation from '../../interactions/navigation';
import { RoomData } from '../../support/types';

/**
 * Rooms Search and Sort Tests (Home page)
 * Tests the ScopeTitle search/sort controls on the rooms list: toggling the
 * panel, filtering by room name, the no-results state, sorting by name and
 * reversing the direction.
 *
 * Seeds three rooms whose names share a prefix and differ only in the final
 * letter, so both the search count and the name sort order are deterministic.
 * Cleanup is handled by globalTeardown (test-room-* prefix).
 */
test('Rooms Search and Sort (Home page)', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const roomA: RoomData = { ...entities.createRoom('sort-a'), users: [seededUser] };
  const roomB: RoomData = { ...roomA, name: roomA.name.replace(/-a$/, '-b') };
  const roomC: RoomData = { ...roomA, name: roomA.name.replace(/-a$/, '-c') };
  const sharedPrefix = roomA.name.slice(0, -1);

  const Heading = userPage.locator('h1');
  const SearchToggle = userPage.getByTestId(TEST_IDS.SEARCH_BUTTON);
  const ScopeControls = userPage.getByTestId(TEST_IDS.SCOPE_CONTROLS);
  const SearchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
  const SortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT);
  const SortDirection = userPage.getByTestId(TEST_IDS.SORT_DIRECTION_BUTTON);
  const RoomCards = userPage.getByTestId(TEST_IDS.ROOM_CARD);
  const NoResultsState = userPage.getByTestId('rooms-no-results-state');

  const expectOrder = async (names: string[]) => {
    await expect(RoomCards).toHaveCount(names.length);
    for (const [i, name] of names.entries()) {
      await expect(RoomCards.nth(i).locator('h2')).toHaveText(name);
    }
  };

  await test.step('Admin - Create three rooms to search and sort', async () => {
    for (const room of [roomA, roomB, roomC]) {
      await roomsSettings.create(adminPage, room);
    }

    await navigation.goToHome(userPage);
    await expect(RoomCards.first()).toBeVisible();
  });

  await test.step('Toggle opens the controls and focuses the search field', async () => {
    // the closed panel is clipped + inert, not hidden — assert inert instead of visibility
    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(ScopeControls).toHaveAttribute('inert', '');

    await SearchToggle.click();

    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(ScopeControls).not.toHaveAttribute('inert');
    await expect(SearchField).toBeFocused();
  });

  await test.step('Search filters by room name and the heading count follows', async () => {
    await SearchField.fill(roomB.name);

    await expectOrder([roomB.name]);
    await expect(Heading).toContainText('1');

    await SearchField.fill(sharedPrefix);
    await expect(RoomCards).toHaveCount(3);
    await expect(Heading).toContainText('3');
  });

  await test.step('No matches shows the no-results state, not the empty state', async () => {
    await SearchField.fill('xyznonexistentroom123456789');

    await expect(NoResultsState).toBeVisible();
    await expect(RoomCards).toHaveCount(0);
    await expect(userPage.getByTestId('rooms-empty-state')).toHaveCount(0);
  });

  await test.step('Search survives characters that are not part of any name', async () => {
    for (const char of ['@', '#', '$', '%']) {
      await SearchField.fill(char);
      await expect(NoResultsState).toBeVisible();
    }

    await SearchField.fill(sharedPrefix);
    await expect(RoomCards).toHaveCount(3);
  });

  await test.step('Closing the controls clears the search', async () => {
    await SearchToggle.click();

    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'false');
    // The seeded three were the only matches, so clearing brings the other rooms back.
    await expect.poll(() => RoomCards.count()).toBeGreaterThan(3);

    await SearchToggle.click();
    await expect(SearchField).toHaveValue('');
  });

  await test.step('Sort by name orders the rooms alphabetically', async () => {
    await SearchField.fill(sharedPrefix);

    await SortSelect.click();
    await userPage.getByTestId('sort-select-option-room_name').click();

    await expectOrder([roomA.name, roomB.name, roomC.name]);
  });

  await test.step('Direction button reverses the order', async () => {
    await expect(SortDirection).toHaveAttribute('aria-pressed', 'false');

    await SortDirection.click();

    await expect(SortDirection).toHaveAttribute('aria-pressed', 'true');
    await expectOrder([roomC.name, roomB.name, roomA.name]);

    await SortDirection.click();
    await expect(SortDirection).toHaveAttribute('aria-pressed', 'false');
    await expectOrder([roomA.name, roomB.name, roomC.name]);
  });

  await test.step('Search survives a change of sort option', async () => {
    await SortSelect.click();
    await userPage.getByTestId('sort-select-option-created').click();

    await expect(SearchField).toHaveValue(sharedPrefix);
    await expect(RoomCards).toHaveCount(3);
  });

  await test.step('Selected sort option is marked in the listbox', async () => {
    await SortSelect.click();

    await expect(userPage.getByTestId('sort-select-option-created')).toHaveAttribute('aria-selected', 'true');
    await expect(userPage.getByTestId('sort-select-option-room_name')).toHaveAttribute('aria-selected', 'false');

    // Escape closes the listbox
    await userPage.keyboard.press('Escape');
    await expect(SortSelect).toHaveAttribute('aria-expanded', 'false');
  });
});
