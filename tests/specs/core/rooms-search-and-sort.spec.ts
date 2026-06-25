import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as roomsSettings from '../../interactions/admin-settings/rooms';
import * as dashboardRooms from '../../interactions/dashboard-rooms';
import * as navigation from '../../interactions/navigation';
import { RoomData } from '../../support/types';

/**
 * Room Search and Sort Tests
 * Tests search and sort functionality on the Rooms View (Home Page)
 *
 * Runs after the core project (depends: ['core']) so the room list is stable.
 * Seeds one dedicated room in beforeAll so search-count assertions are
 * deterministic regardless of what other test runs left behind.
 * Cleanup is handled by globalTeardown (test-room-* prefix).
 */
test('Rooms Search (Dashboard/Home page)', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  let room: RoomData = entities.createRoom('search-sort');
  room.users = [seededUser];
  await roomsSettings.create(adminPage, room);

  await test.step('Search', async () => {
    await test.step('Open search field', async () => {
      navigation.goToHome(userPage);
      await dashboardRooms.openSearch(userPage);

      const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
      await expect(searchField).toBeVisible();
    });

    await test.step('Close search field', async () => {
      await dashboardRooms.closeSearch(userPage);
      const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
      await expect(searchField).not.toBeVisible();
    });

    await test.step('should filter rooms based on search query', async () => {
      await test.step('verify there are existing rooms', async () => {
        const initialCount = await dashboardRooms.getCountOfRoomsDisplayed(userPage);
        // Schule (standard room), e2e.class_1A (seeded), search-sort (room created for this test)
        expect(initialCount).toBe(3);
      });

      await test.step('Search for seeded room by exact name', async () => {
        await dashboardRooms.searchRooms(userPage, room.name);

        const filteredCount = await dashboardRooms.getCountOfRoomsDisplayed(userPage);
        expect(filteredCount).toBe(1);
      });
    });

    await test.step('should show all rooms when search filter is cleared', async () => {
      await dashboardRooms.searchRooms(userPage, 'test');
      await dashboardRooms.clearSearch(userPage);

      const allCount = await dashboardRooms.getCountOfRoomsDisplayed(userPage);
      expect(allCount).toBe(3);
    });

    await test.step('should focus search field when opened', async () => {
      await navigation.goToHome(userPage);
      await userPage.getByTestId(TEST_IDS.SEARCH_BUTTON).filter({ visible: true }).click();

      const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
      await expect(searchField).toBeFocused();
    });

    await test.step('should handle search with no results', async () => {
      await dashboardRooms.searchRooms(userPage, 'xyznonexistentroom123456789');

      await expect(userPage.getByTestId(TEST_IDS.ROOM_CARD)).toHaveCount(0);
    });
  });

  await test.step('Sort Functionality', async () => {
    await test.step('should open and close sort panel', async () => {
      await test.step('Open sort panel', async () => {
        await dashboardRooms.openSortMenu(userPage);
        const sortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT);
        await expect(sortSelect).toBeVisible();
      });

      await test.step('Close sort panel', async () => {
        await dashboardRooms.closeSortMenu(userPage);
        const sortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT);
        await expect(sortSelect).not.toBeVisible();
      });
    });

    await test.step('Select different sort option', async () => {
      await dashboardRooms.openSortMenu(userPage);
      await dashboardRooms.selectSortOption(userPage, 'room_name');

      const sortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT).locator('input, select');
      await expect(sortSelect).toHaveValue('room_name');
    });

    await test.step('should toggle sort direction', async () => {
      await dashboardRooms.openSortMenu(userPage);

      const sortDirectionButton = userPage.getByTestId('sort-direction-button');
      const initialIcon = await sortDirectionButton.getAttribute('aria-label');

      await dashboardRooms.toggleSortDirection(userPage);

      // Wait for the debounce (150ms in ScopeHeader) to complete
      await userPage.waitForTimeout(200);

      const newIcon = await sortDirectionButton.getAttribute('aria-label');
      expect(newIcon).not.toBe(initialIcon);
    });

    await test.step('should show all sort options', async () => {
      await dashboardRooms.openSortMenu(userPage);
      const sortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT);
      await sortSelect.click();

      // @TODO: Check for common sort options
      const createdOption = userPage.getByTestId('sort-option-created');
      await expect(createdOption).toBeVisible();
    });
  });

  await test.step('should maintain search query when changing sort', async () => {
    // Refresh the page so the sort menu is closed and search field reset
    await navigation.goToHome(userPage);

    const searchTerm = 'test';
    await dashboardRooms.searchRooms(userPage, searchTerm);

    // Change sort option
    await dashboardRooms.openSortMenu(userPage);
    await dashboardRooms.selectSortOption(userPage, 'room_name');

    // Verify search is still active
    const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
    await expect(searchField).toHaveValue(searchTerm);
  });

  await test.step('should close empty search when sort is opened', async () => {
    // Refresh the page so the sort menu is closed and search field reset
    await navigation.goToHome(userPage);

    await dashboardRooms.openSearch(userPage);
    await dashboardRooms.openSortMenu(userPage);

    // Verify search is closed
    const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
    await expect(searchField).not.toBeVisible();
  });

  await test.step('should keep search open when it has value and sort is opened', async () => {
    // Refresh the page so the sort menu is closed and search field reset
    await navigation.goToHome(userPage);
    const searchTerm = 'test';

    // Search with value
    await dashboardRooms.searchRooms(userPage, searchTerm);

    await dashboardRooms.openSortMenu(userPage);

    // Verify search remains open
    const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
    await expect(searchField).toBeVisible();
    const searchInput = userPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
    await expect(searchInput).toHaveValue(searchTerm);
  });

  // @TODO: write more complex test with two rooms matching the filter and verify sort is working in both directions
  await test.step('should apply both search and sort together', async () => {
    // Refresh the page so the sort menu is closed and search field reset
    await navigation.goToHome(userPage);

    const firstRoomName = await dashboardRooms.getFirstRoomName(userPage);
    expect(firstRoomName).not.toBeNull();

    // search by the starting letters of the room name
    const searchTerm = firstRoomName!.trim().substring(0, 3).toLowerCase();
    expect(searchTerm).toHaveLength(3);
    await dashboardRooms.searchRooms(userPage, searchTerm);

    // open sort, and select sort by room name
    await dashboardRooms.openSortMenu(userPage);
    await dashboardRooms.selectSortOption(userPage, 'room_name');

    // assert we found the first room
    expect(await dashboardRooms.getCountOfRoomsDisplayed(userPage)).toBe(1);
  });

  await test.step('Edge Cases', async () => {
    await test.step('should handle special characters in search', async () => {
      // Refresh the page so the sort menu is closed and search field reset
      await navigation.goToHome(userPage);

      const specialChars = ['@', '#', '$', '%'];
      for (const char of specialChars) {
        await test.step(`Search with ${char}`, async () => {
          await dashboardRooms.searchRooms(userPage, char);
          // Should not crash — clearSearch succeeding is the assertion
          await dashboardRooms.clearSearch(userPage);
        });
      }
    });

    await test.step('should handle rapid sort option changes', async () => {
      await test.step('Rapidly change sort options', async () => {
        // Refresh the page so the sort menu is closed and search field reset
        await navigation.goToHome(userPage);
        await dashboardRooms.openSortMenu(userPage);
        await dashboardRooms.selectSortOption(userPage, 'room_name');
        await dashboardRooms.selectSortOption(userPage, 'created');
        await dashboardRooms.selectSortOption(userPage, 'last_update');
      });

      await test.step('Verify final sort option', async () => {
        const sortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT).locator('input, select');
        await expect(sortSelect).toHaveValue('last_update');
      });
    });

    await test.step('should preserve search when toggling sort panel', async () => {
      // Refresh the page so the sort menu is closed and search field reset
      await navigation.goToHome(userPage);

      const searchTerm = 'persistent';
      await dashboardRooms.searchRooms(userPage, searchTerm);

      // Toggle sort panel multiple times
      await dashboardRooms.openSortMenu(userPage);
      await dashboardRooms.closeSortMenu(userPage);
      await dashboardRooms.openSortMenu(userPage);
      await dashboardRooms.closeSortMenu(userPage);

      // Verify search persists
      const searchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
      await expect(searchField).toHaveValue(searchTerm);
    });
  });
});
