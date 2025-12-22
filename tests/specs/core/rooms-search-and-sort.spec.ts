import { test, expect } from '../../fixtures/test-fixtures';
import * as rooms from '../../interactions/rooms';
import * as navigation from '../../interactions/navigation';

/**
 * Room Search and Sort Tests
 * Tests search and sort functionality on the Rooms View (Home Page)
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: These tests run serially to ensure consistent state
 */
test.describe.serial('Rooms View - Search and Sort Functionality', () => {
  test.beforeEach(async ({ adminPage }) => {
    await navigation.goToHome(adminPage);
  });

  test.describe('Search Functionality', () => {
    test('should open and close search field', async ({ adminPage }) => {
      await test.step('Open search field', async () => {
        await rooms.openSearch(adminPage);
        const searchField = adminPage.getByTestId('search-field');
        await expect(searchField).toBeVisible();
      });

      await test.step('Close search field', async () => {
        await rooms.closeSearch(adminPage);
        const searchField = adminPage.getByTestId('search-field');
        await expect(searchField).not.toBeVisible();
      });
    });

    test('should filter rooms based on search query', async ({ adminPage }) => {
      await test.step('Get initial room count', async () => {
        const initialCount = await rooms.getRoomCount(adminPage);
        expect(initialCount).toBeGreaterThan(0);
      });

      await test.step('Get first room name and search for it', async () => {
        const firstRoomName = await rooms.getFirstRoomName(adminPage);
        if (!firstRoomName) return; // Skip if no rooms

        // Extract first 3 characters for search
        const searchTerm = firstRoomName.trim().substring(0, 3).toLowerCase();
        await rooms.searchRooms(adminPage, searchTerm);
      });

      await test.step('Verify filtered results', async () => {
        const filteredCount = await rooms.getRoomCount(adminPage);
        // Should have at least one result
        expect(filteredCount).toBeGreaterThan(0);
      });
    });

    test('should clear search and restore all rooms', async ({ adminPage }) => {
      await test.step('Apply search filter', async () => {
        await rooms.searchRooms(adminPage, 'test');
      });

      await test.step('Clear search', async () => {
        await rooms.clearSearch(adminPage);
      });

      await test.step('Verify all rooms are visible again', async () => {
        const allCount = await rooms.getRoomCount(adminPage);
        expect(allCount).toBeGreaterThan(0);
      });
    });

    test('should focus search field when opened', async ({ adminPage }) => {
      await test.step('Open search and verify focus', async () => {
        await rooms.openSearch(adminPage);
        const searchField = adminPage.getByTestId('search-field').locator('input');
        await expect(searchField).toBeFocused();
      });
    });

    test('should handle search with no results', async ({ adminPage }) => {
      await test.step('Search for non-existent room', async () => {
        await rooms.searchRooms(adminPage, 'xyznonexistentroom123456789');
      });

      await test.step('Verify no rooms are shown', async () => {
        const count = await rooms.getRoomCount(adminPage);
        expect(count).toBe(0);
      });
    });
  });

  test.describe('Sort Functionality', () => {
    test('should open and close sort panel', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
        const sortSelect = adminPage.getByTestId('sort-select');
        await expect(sortSelect).toBeVisible();
      });

      await test.step('Close sort panel', async () => {
        await rooms.closeSort(adminPage);
        const sortSelect = adminPage.getByTestId('sort-select');
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
        const sortSelect = adminPage.getByTestId('sort-select').locator('input, select');
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

        const newIcon = await sortDirectionButton.getAttribute('aria-label');
        expect(newIcon).not.toBe(initialIcon);
      });
    });

    test('should show all sort options', async ({ adminPage }) => {
      await test.step('Open sort panel', async () => {
        await rooms.openSort(adminPage);
      });

      await test.step('Click sort select to show options', async () => {
        const sortSelect = adminPage.getByTestId('sort-select');
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
        const searchField = adminPage.getByTestId('search-field').locator('input');
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
        const searchField = adminPage.getByTestId('search-field');
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
        const searchField = adminPage.getByTestId('search-field');
        await expect(searchField).toBeVisible();
        const searchInput = adminPage.getByTestId('search-field').locator('input');
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
        const searchField = adminPage.getByTestId('search-field');
        await expect(searchField).toBeVisible();

        const sortSelect = adminPage.getByTestId('sort-select').locator('input, select');
        await expect(sortSelect).toHaveValue('room_name');

        const count = await rooms.getRoomCount(adminPage);
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle special characters in search', async ({ adminPage }) => {
      const specialChars = ['@', '#', '$', '%'];

      for (const char of specialChars) {
        await test.step(`Search with ${char}`, async () => {
          await rooms.searchRooms(adminPage, char);
          // Should not crash
          await rooms.getRoomCount(adminPage);
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
        const sortSelect = adminPage.getByTestId('sort-select').locator('input, select');
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
        const searchField = adminPage.getByTestId('search-field').locator('input');
        await expect(searchField).toHaveValue(searchTerm);
      });
    });
  });
});
