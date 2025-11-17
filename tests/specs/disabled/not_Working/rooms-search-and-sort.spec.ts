import { test } from '@playwright/test';
import { describeWithSetup } from '../../lifecycle/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { RoomSearchSortTestHelpers, RoomSearchSortTestContext } from '../../shared/helpers/rooms-search-sort';

describeWithSetup('Rooms View - Search and Sort Functionality', () => {
  const cleanupQueue: Array<{ page: any; context: RoomSearchSortTestContext }> = [];

  test.afterEach(async () => {
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await RoomSearchSortTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test.describe('Search Functionality', () => {
    test('should open search field when search button is clicked', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            await context.searchSortPage.verifySearchButtonState('open');
            await context.searchSortPage.verifySearchFieldFocused();
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should close search field when close button is clicked', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            const isOpenBefore = await context.searchSortPage.isSearchOpen();
            if (!isOpenBefore) throw new Error('Search should be open');

            await context.searchSortPage.closeSearch();
            await context.searchSortPage.verifySearchButtonState('closed');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should filter rooms based on room name search', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.captureInitialState(context);

            if (!context.initialRoomCount || context.initialRoomCount === 0) {
              return; // Skip if no rooms exist
            }

            const firstRoomText = await context.searchSortPage.getFirstRoomText();
            if (!firstRoomText) return;

            const searchTerm = firstRoomText.trim().substring(0, 3).toLowerCase();
            await RoomSearchSortTestHelpers.testBasicSearch(context, searchTerm);

            const currentCount = await context.searchSortPage.getRoomCount();
            if (currentCount > 0 && context.initialRoomCount) {
              if (currentCount > context.initialRoomCount) {
                throw new Error('Filtered results should not exceed initial count');
              }
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should show empty state when no rooms match search', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testSearchWithEmptyResults(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should clear search and show all rooms when search is cleared', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.searchRooms('test');
            const filteredCount = await context.searchSortPage.getRoomCount();

            await context.searchSortPage.clearSearch();
            const allCount = await context.searchSortPage.getRoomCount();

            if (allCount < filteredCount) {
              throw new Error('Clearing search should show more or equal rooms');
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should have placeholder text when search is opened', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            await context.searchSortPage.verifySearchPlaceholder();
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should have proper button states and accessibility', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.verifySearchButtonState('closed');
            await context.searchSortPage.openSearch();
            await context.searchSortPage.verifySearchButtonState('open');
            await RoomSearchSortTestHelpers.testAccessibility(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Sort Functionality', () => {
    test('should open sort panel when sort button is clicked', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.verifySortButtonState('open');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should close sort panel when close button is clicked', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.verifySortButtonState('open');
            await context.searchSortPage.closeSort();
            await context.searchSortPage.verifySortButtonState('closed');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should change sort option when different sort is selected', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.selectSortOption('roomName');

            const currentValue = await context.searchSortPage.getCurrentSortValue();
            if (currentValue !== 'room_name') {
              throw new Error(`Expected 'room_name', got '${currentValue}'`);
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should toggle sort direction when direction button is clicked', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testSortDirection(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should show different sort options in dropdown', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.verifyAllSortOptionsVisible();
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should have proper sort control states and accessibility', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.verifySortButtonState('closed');
            await context.searchSortPage.verifySortDirection('asc');

            await context.searchSortPage.openSort();
            await context.searchSortPage.verifySortButtonState('open');
            await context.searchSortPage.verifySortDirection('asc');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should update sort direction when toggled', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.verifySortDirection('asc');
            await context.searchSortPage.openSort();
            await context.searchSortPage.toggleSortDirection();
            await context.searchSortPage.verifySortDirection('desc');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Combined Search and Sort', () => {
    test('should maintain search query when changing sort options', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testSearchPersistsDuringSortChange(context, 'test');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should close search when sort is opened and search is empty', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testSearchClosesWhenEmptyAndSortOpens(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should keep search open when sort is opened and search has value', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testSearchStaysOpenWhenFilledAndSortOpens(context, 'test');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should apply both search and sort filters together', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.captureInitialState(context);

            if (!context.initialRoomCount || context.initialRoomCount === 0) {
              return; // Skip if no rooms exist
            }

            const firstRoomText = await context.searchSortPage.getFirstRoomText();
            if (!firstRoomText) return;

            const searchTerm = firstRoomText.trim().substring(0, 3).toLowerCase();
            await RoomSearchSortTestHelpers.testCombinedSearchAndSort(context, searchTerm, 'roomName');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation for search', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testKeyboardNavigation(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should support escape key to close search', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            await context.searchSortPage.pressEscapeOnSearch();

            const isSearchOpen = await context.searchSortPage.isSearchOpen();
            if (isSearchOpen) {
              throw new Error('Search should close after pressing Escape');
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testMobileResponsiveness(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should maintain functionality on tablet viewport', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testTabletResponsiveness(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully during search', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.testNetworkErrorHandling(context);
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });

  test.describe('Focused Single-Purpose Tests', () => {
    test('should focus search field immediately when search button is activated', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            await context.searchSortPage.verifySearchFieldFocused();
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should clear search results when search field is emptied', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await RoomSearchSortTestHelpers.captureInitialState(context);
            const searchTerm = 'test';

            await context.searchSortPage.searchRooms(searchTerm);
            const filteredCount = await context.searchSortPage.getRoomCount();

            await context.searchSortPage.clearSearch();
            const clearedCount = await context.searchSortPage.getRoomCount();

            if (context.initialRoomCount && clearedCount < filteredCount) {
              throw new Error('Clearing search should restore more results');
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should maintain sort state when search is applied', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.selectSortOption('roomName');

            await context.searchSortPage.searchRooms('test');

            const currentSortValue = await context.searchSortPage.getCurrentSortValue();
            if (currentSortValue !== 'room_name') {
              throw new Error('Sort selection should persist when search is applied');
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should reset to default sort direction after page reload', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();
            await context.searchSortPage.toggleSortDirection();
            await context.searchSortPage.verifySortDirection('desc');

            await context.searchSortPage.navigateToHomePage();
            await context.searchSortPage.verifySortDirection('asc');
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should show placeholder when search field is empty', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSearch();
            const searchField = await context.searchSortPage.getSearchField();
            await searchField.fill('test');
            await searchField.clear();
            await context.searchSortPage.verifySearchPlaceholder();
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should handle rapid sort option changes gracefully', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            await context.searchSortPage.openSort();

            // Rapidly change sort options
            await context.searchSortPage.selectSortOption('roomName');
            await context.searchSortPage.selectSortOption('created');
            await context.searchSortPage.selectSortOption('orderImportance');

            const finalValue = await context.searchSortPage.getCurrentSortValue();
            if (finalValue !== 'order_importance') {
              throw new Error(`Expected 'order_importance', got '${finalValue}'`);
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should handle search with special characters', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            const specialChars = ['@', '#', '$', '%', '&'];

            for (const char of specialChars) {
              await context.searchSortPage.searchRooms(char);
              // Should not crash and should show empty state or filtered results
              await context.searchSortPage.getRoomCount();
              // Test passes if no error is thrown

              await context.searchSortPage.clearSearch();
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('should preserve search input when toggling sort panel', async () => {
      const admin = await BrowserHelpers.openPageForUser('admin');

      try {
        await RoomSearchSortTestHelpers.executeWithCleanup(
          admin,
          async (context) => {
            const searchTerm = 'persistent';
            await context.searchSortPage.searchRooms(searchTerm);

            // Open and close sort multiple times
            await context.searchSortPage.openSort();
            await context.searchSortPage.closeSort();
            await context.searchSortPage.openSort();
            await context.searchSortPage.closeSort();

            const currentSearchValue = await context.searchSortPage.getSearchValue();
            if (currentSearchValue !== searchTerm) {
              throw new Error(`Search value should persist. Expected: ${searchTerm}, Got: ${currentSearchValue}`);
            }
          },
          false,
          cleanupQueue
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });
  });
});
