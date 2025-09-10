import { Page } from '@playwright/test';
import { RoomSearchSortPage } from '../interactions/search-sort';
import { TestDataBuilder } from '../base-test';
import * as shared from '../shared';
import * as rooms from '../interactions/rooms';
import * as fixtures from '../../fixtures/users';

export interface RoomSearchSortTestContext {
  searchSortPage: RoomSearchSortPage;
  testRooms?: any[];
  searchTerm?: string;
  initialRoomCount?: number;
}

export class RoomSearchSortTestHelpers {
  static async setupSearchSortTest(page: Page): Promise<RoomSearchSortTestContext> {
    const searchSortPage = new RoomSearchSortPage(page);
    await searchSortPage.navigateToHomePage();

    return {
      searchSortPage,
    };
  }

  static async setupWithTestRooms(page: Page, roomCount: number = 3): Promise<RoomSearchSortTestContext> {
    const context = await this.setupSearchSortTest(page);
    const testRooms: any[] = [];

    // Create test rooms with predictable names for search/sort testing
    const baseNames = ['Alpha Room', 'Beta Room', 'Gamma Room'];
    for (let i = 0; i < roomCount && i < baseNames.length; i++) {
      const roomData = TestDataBuilder.createRoom(`${baseNames[i]}-${shared.gensym()}`, [fixtures.alice, fixtures.bob]);
      await rooms.create(page, roomData);
      testRooms.push(roomData);
    }

    context.testRooms = testRooms;
    await context.searchSortPage.navigateToHomePage();

    return context;
  }

  static async captureInitialState(context: RoomSearchSortTestContext): Promise<void> {
    context.initialRoomCount = await context.searchSortPage.getRoomCount();
  }

  static generateSearchTerm(context: RoomSearchSortTestContext): string | null {
    if (!context.testRooms || context.testRooms.length === 0) return null;

    // Use first 3 characters of the first test room for language-agnostic search
    const firstRoom = context.testRooms[0];
    return firstRoom.name.substring(0, 3).toLowerCase();
  }

  static async testBasicSearch(context: RoomSearchSortTestContext, searchTerm: string): Promise<void> {
    await context.searchSortPage.searchRooms(searchTerm);

    const roomCount = await context.searchSortPage.getRoomCount();
    if (roomCount > 0) {
      await context.searchSortPage.verifyRoomsContainText(searchTerm);
    }
  }

  static async testSearchWithEmptyResults(context: RoomSearchSortTestContext): Promise<void> {
    const uniqueSearchTerm = 'nonexistentroom' + shared.gensym();
    await context.searchSortPage.searchRooms(uniqueSearchTerm);
    await context.searchSortPage.verifyEmptyState();
  }

  static async testBasicSort(
    context: RoomSearchSortTestContext,
    sortOption: 'orderImportance' | 'roomName' | 'created' | 'lastUpdate'
  ): Promise<void> {
    await context.searchSortPage.openSort();
    await context.searchSortPage.selectSortOption(sortOption);

    // Wait for sorting to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (sortOption === 'roomName') {
      await context.searchSortPage.verifyRoomsSortedAlphabetically();
    }
  }

  static async testSortDirection(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.openSort();

    // Verify initial state is ascending
    await context.searchSortPage.verifySortDirection('asc');

    // Toggle to descending
    await context.searchSortPage.toggleSortDirection();
    await context.searchSortPage.verifySortDirection('desc');

    // Toggle back to ascending
    await context.searchSortPage.toggleSortDirection();
    await context.searchSortPage.verifySortDirection('asc');
  }

  static async testCombinedSearchAndSort(
    context: RoomSearchSortTestContext,
    searchTerm: string,
    sortOption: 'orderImportance' | 'roomName' | 'created' | 'lastUpdate'
  ): Promise<void> {
    await context.searchSortPage.searchAndSort(searchTerm, sortOption);

    const roomCount = await context.searchSortPage.getRoomCount();
    if (roomCount > 0) {
      await context.searchSortPage.verifyRoomsContainText(searchTerm);

      if (sortOption === 'roomName') {
        await context.searchSortPage.verifyRoomsSortedAlphabetically();
      }
    }
  }

  static async testSearchPersistsDuringSortChange(
    context: RoomSearchSortTestContext,
    searchTerm: string
  ): Promise<void> {
    await context.searchSortPage.searchRooms(searchTerm);
    await context.searchSortPage.openSort();
    await context.searchSortPage.selectSortOption('roomName');

    const currentSearchValue = await context.searchSortPage.getSearchValue();
    if (currentSearchValue !== searchTerm) {
      throw new Error(`Search value should persist. Expected: ${searchTerm}, Got: ${currentSearchValue}`);
    }
  }

  static async testSearchClosesWhenEmptyAndSortOpens(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.openSearch();
    // Don't fill search field, leave it empty

    // Verify search is open before we open sort
    await context.searchSortPage.verifySearchButtonState('open');

    await context.searchSortPage.openSort();

    // Wait a bit for the state changes to propagate
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isSearchOpen = await context.searchSortPage.isSearchOpen();
    if (isSearchOpen) {
      throw new Error('Search should close when sort is opened and search is empty');
    }

    // Also verify the button state
    await context.searchSortPage.verifySearchButtonState('closed');
  }

  static async testSearchStaysOpenWhenFilledAndSortOpens(
    context: RoomSearchSortTestContext,
    searchTerm: string
  ): Promise<void> {
    await context.searchSortPage.searchRooms(searchTerm);
    await context.searchSortPage.openSort();

    const isSearchOpen = await context.searchSortPage.isSearchOpen();
    if (!isSearchOpen) {
      throw new Error('Search should stay open when sort is opened and search has value');
    }
  }

  static async testKeyboardNavigation(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.focusSearchButton();
    await context.searchSortPage.verifySearchButtonFocused();

    await context.searchSortPage.pressEnterOnSearchButton();
    await context.searchSortPage.verifySearchFieldFocused();

    await context.searchSortPage.pressEscapeOnSearch();
    const isSearchOpen = await context.searchSortPage.isSearchOpen();
    if (isSearchOpen) {
      throw new Error('Search should close after pressing Escape');
    }
  }

  static async testMobileResponsiveness(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.setMobileViewport();

    await context.searchSortPage.openSearch();
    const isSearchOpen = await context.searchSortPage.isSearchOpen();
    if (!isSearchOpen) {
      throw new Error('Search should work on mobile viewport');
    }

    await context.searchSortPage.openSort();
    await context.searchSortPage.verifySortButtonState('open');
  }

  static async testTabletResponsiveness(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.setTabletViewport();

    await context.searchSortPage.openSearch();
    await context.searchSortPage.openSort();
    await context.searchSortPage.verifyAllSortOptionsVisible();
  }

  static async testNetworkErrorHandling(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.simulateNetworkError();
    await context.searchSortPage.searchRooms('test');
    await context.searchSortPage.verifyErrorState();
  }

  static async testAccessibility(context: RoomSearchSortTestContext): Promise<void> {
    await context.searchSortPage.openSearch();
    await context.searchSortPage.verifySearchFieldAccessibility();
    await context.searchSortPage.verifySearchPlaceholder();
    await context.searchSortPage.verifySearchButtonState('open');
  }

  static async cleanupTestData(page: Page, context: RoomSearchSortTestContext): Promise<void> {
    const errors: Error[] = [];

    if (context.testRooms) {
      for (const room of context.testRooms) {
        try {
          await rooms.remove(page, room);
        } catch (e: any) {
          errors.push(new Error(`Failed to cleanup room ${room.name}: ${e.message}`));
        }
      }
    }

    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: RoomSearchSortTestContext) => Promise<T>,
    setupTestRooms: boolean = false,
    emergencyCleanupQueue?: Array<{ page: any; context: RoomSearchSortTestContext }>
  ): Promise<T> {
    const context = setupTestRooms ? await this.setupWithTestRooms(page) : await this.setupSearchSortTest(page);

    if (emergencyCleanupQueue) {
      emergencyCleanupQueue.push({ page, context });
    }

    try {
      return await testLogic(context);
    } finally {
      if (emergencyCleanupQueue) {
        const index = emergencyCleanupQueue.findIndex((item) => item.context === context);
        if (index >= 0) {
          emergencyCleanupQueue.splice(index, 1);
        }
      }

      await this.cleanupTestData(page, context);
    }
  }
}
