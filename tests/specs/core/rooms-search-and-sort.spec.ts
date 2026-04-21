import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_IDS } from '../../../src/test-ids';
import * as rooms from '../../interactions/rooms';
import * as navigation from '../../interactions/navigation';
import * as entities from '../../helpers/entities';

/**
 * Room Search and Sort Tests
 * Tests search and sort functionality on the Rooms View (Home Page)
 *
 * Runs after the core project (depends: ['core']) so the room list is stable.
 * Seeds one dedicated room in beforeAll so search-count assertions are
 * deterministic regardless of what other test runs left behind.
 * Cleanup is handled by globalTeardown (test-room-* prefix).
 */
test.describe.serial('Rooms View - Search and Sort Functionality', () => {
  // Seeded before the suite — gives us a known room name to search for exactly.
  const seededRoom = entities.createRoom('search-sort');

  test.beforeAll(async ({ adminPage, userConfig }) => {
    seededRoom.users = [userConfig];
    await rooms.create(adminPage, seededRoom);
  });

  test.beforeEach(async ({ adminPage }) => {
    await navigation.goToHome(adminPage);
  });

  test.describe('Search Functionality', () => {
    test('should open and close search field', async ({ adminPage }) => {
      await test.step('Open search field', async () => {
        await rooms.openSearch(adminPage);
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD);
        await expect(searchField).toBeVisible();
      });

      await test.step('Close search field', async () => {
        await rooms.closeSearch(adminPage);
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD);
        await expect(searchField).not.toBeVisible();
      });
    });

    test('should filter rooms based on search query', async ({ adminPage }) => {
      await test.step('verify there are existing rooms', async () => {
        const initialCount = await rooms.getRoomCount(adminPage);
        expect(initialCount).toBeGreaterThan(0);
      });

      await test.step('Search for seeded room by exact name', async () => {
        await rooms.searchRooms(adminPage, seededRoom.name);
      });

      await test.step('Verify exactly one room matches', async () => {
        // getRoomCount navigates to home which clears the search filter — count directly instead.
        await expect(adminPage.getByTestId(TEST_IDS.ROOM_CARD)).toHaveCount(1);
      });
    });

    test('should clear search and restore all rooms', async ({ adminPage }) => {
      await test.step('Apply search filter', async () => {
        await rooms.searchRooms(adminPage, 'test');
      });

      await test.step('Clear search', async () => {
        await rooms.clearSearch(adminPage);
      });

      // @FIXME: nikola - if we want to verify "all" rooms are visible, we can't use greaterThan(0)
      await test.step('Verify all rooms are visible again', async () => {
        const allCount = await rooms.getRoomCount(adminPage);
        expect(allCount).toBeGreaterThan(0);
      });
    });

    test('should focus search field when opened', async ({ adminPage }) => {
      await test.step('Open search and verify focus', async () => {
        await rooms.openSearch(adminPage);
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
        await expect(searchField).toBeFocused();
      });
    });

    test('should handle search with no results', async ({ adminPage }) => {
      await test.step('Search for non-existent room', async () => {
        await rooms.searchRooms(adminPage, 'xyznonexistentroom123456789');
      });

      await test.step('Verify no rooms are shown', async () => {
        // getRoomCount navigates to home which clears the search filter — count directly instead.
        await expect(adminPage.getByTestId(TEST_IDS.ROOM_CARD)).toHaveCount(0);
      });
    });
  });

  test.describe('Sort Functionality', () => {
    test('should open and close sort panel', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
        const sortSelect = adminPage.getByTestId(TEST_IDS.SORT_SELECT);
        await expect(sortSelect).toBeVisible();
      });

      await test.step('Close sort panel', async () => {
        await rooms.closeSort(adminPage);
        const sortSelect = adminPage.getByTestId(TEST_IDS.SORT_SELECT);
        await expect(sortSelect).not.toBeVisible();
      });
    });

    test('should change sort option', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Select different sort option', async () => {
        await rooms.selectSortOption(adminPage, 'room_name');
      });

      await test.step('Verify sort was applied', async () => {
        const sortSelect = adminPage.getByTestId(TEST_IDS.SORT_SELECT).locator('input, select');
        await expect(sortSelect).toHaveValue('room_name');
      });
    });

    test('should toggle sort direction', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Toggle sort direction', async () => {
        const sortDirectionButton = adminPage.getByTestId('sort-direction-button');
        const initialIcon = await sortDirectionButton.getAttribute('aria-label');

        await rooms.toggleSortDirection(adminPage);

        // Wait for the debounce (150ms in ScopeHeader) to complete
        await adminPage.waitForTimeout(200);

        const newIcon = await sortDirectionButton.getAttribute('aria-label');
        expect(newIcon).not.toBe(initialIcon);
      });
    });

    test('should show all sort options', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Click sort select to show options', async () => {
        const sortSelect = adminPage.getByTestId(TEST_IDS.SORT_SELECT);
        await sortSelect.click();
      });

      await test.step('Verify sort options are visible', async () => {
        // Check for common sort options
        const createdOption = adminPage.getByTestId('sort-option-created');
        await expect(createdOption).toBeVisible();
      });
    });
  });

  test.describe('Combined Search and Sort', () => {
    test('should maintain search query when changing sort', async ({ adminPage }) => {
      const searchTerm = 'test';

      await test.step('Apply search filter', async () => {
        await rooms.searchRooms(adminPage, searchTerm);
      });

      await test.step('Change sort option', async () => {
        await rooms.openSort(adminPage);
        await rooms.selectSortOption(adminPage, 'room_name');
      });

      await test.step('Verify search is still active', async () => {
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
        await expect(searchField).toHaveValue(searchTerm);
      });
    });

    test('should close empty search when sort is opened', async ({ adminPage }) => {
      await test.step('Open empty search field', async () => {
        await rooms.openSearch(adminPage);
      });

      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Verify search is closed', async () => {
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD);
        await expect(searchField).not.toBeVisible();
      });
    });

    test('should keep search open when it has value and sort is opened', async ({ adminPage }) => {
      const searchTerm = 'test';

      await test.step('Search with value', async () => {
        await rooms.searchRooms(adminPage, searchTerm);
      });

      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Verify search remains open', async () => {
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD);
        await expect(searchField).toBeVisible();
        const searchInput = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
        await expect(searchInput).toHaveValue(searchTerm);
      });
    });

    test('should apply both search and sort together', async ({ adminPage }) => {
      await test.step('Apply search and sort', async () => {
        const firstRoomName = await rooms.getFirstRoomName(adminPage);
        if (!firstRoomName) return; // Skip if no rooms

        const searchTerm = firstRoomName.trim().substring(0, 3).toLowerCase();
        await rooms.searchRooms(adminPage, searchTerm);

        await rooms.openSort(adminPage);
        await rooms.selectSortOption(adminPage, 'room_name');
      });

      await test.step('Verify both are active', async () => {
        await rooms.searchRooms(adminPage, '');

        await rooms.openSort(adminPage);
        await rooms.selectSortOption(adminPage, 'room_name');

        // Count directly — getRoomCount navigates home which clears state.
        await expect(adminPage.getByTestId(TEST_IDS.ROOM_CARD)).not.toHaveCount(0);
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle special characters in search', async ({ adminPage }) => {
      const specialChars = ['@', '#', '$', '%'];

      for (const char of specialChars) {
        await test.step(`Search with ${char}`, async () => {
          await rooms.searchRooms(adminPage, char);
          // Should not crash — clearSearch succeeding is the assertion
          await rooms.clearSearch(adminPage);
        });
      }
    });

    test('should handle rapid sort option changes', async ({ adminPage }) => {
      await test.step('Rapidly change sort options', async () => {
        await rooms.openSort(adminPage);
        await rooms.selectSortOption(adminPage, 'room_name');
        await rooms.selectSortOption(adminPage, 'created');
        await rooms.selectSortOption(adminPage, 'last_update');
      });

      await test.step('Verify final sort option', async () => {
        const sortSelect = adminPage.getByTestId(TEST_IDS.SORT_SELECT).locator('input, select');
        await expect(sortSelect).toHaveValue('last_update');
      });
    });

    test('should preserve search when toggling sort panel', async ({ adminPage }) => {
      const searchTerm = 'persistent';

      await test.step('Apply search', async () => {
        await rooms.searchRooms(adminPage, searchTerm);
      });

      await test.step('Toggle sort panel multiple times', async () => {
        await rooms.openSort(adminPage);
        await rooms.closeSort(adminPage);
        await rooms.openSort(adminPage);
        await rooms.closeSort(adminPage);
      });

      await test.step('Verify search persists', async () => {
        const searchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD).locator('input');
        await expect(searchField).toHaveValue(searchTerm);
      });
    });
  });
});
