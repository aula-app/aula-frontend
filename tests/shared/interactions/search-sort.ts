import { Page, expect } from '@playwright/test';
import * as shared from '../shared';

export class RoomSearchSortPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get selectors() {
    return {
      searchButton: 'search-button',
      searchField: 'search-field',
      sortButton: 'sort-button',
      sortSelect: 'sort-select',
      sortDirectionButton: 'sort-direction-button',
      roomCardItem: 'room-card-item',
      emptyState: 'empty-state',
      errorState: 'error-state',
      sortOptions: {
        orderImportance: 'sort-option-order_importance',
        roomName: 'sort-option-room_name',
        created: 'sort-option-created',
        lastUpdate: 'sort-option-last_update',
      },
    };
  }

  private get timeouts() {
    return {
      default: 10000,
      short: 5000,
      wait: 500,
      networkWait: 1000,
    };
  }

  async navigateToHomePage(): Promise<void> {
    const host = shared.getHost();
    await this.page.goto(host || 'http://localhost:3000/');
    await this.page.waitForLoadState('networkidle');
  }

  // Search functionality
  async openSearch(): Promise<void> {
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    await expect(searchButton).toBeVisible();

    // Check if already open to avoid unnecessary clicks
    const currentState = await searchButton.getAttribute('data-state');
    if (currentState === 'open') {
      return;
    }

    await searchButton.click();

    // Wait for both the button state change and the search field to become visible
    // This ensures the entire search opening process is complete
    await Promise.all([
      expect(searchButton).toHaveAttribute('data-state', 'open', { timeout: 5000 }),
      expect(this.page.getByRole('searchbox')).toBeVisible({ timeout: 5000 }),
    ]);
  }

  async closeSearch(): Promise<void> {
    const searchButton = this.page.getByTestId(this.selectors.searchButton);

    // Check if already closed to avoid unnecessary clicks
    const currentState = await searchButton.getAttribute('data-state');
    if (currentState === 'closed') {
      return;
    }

    await searchButton.click();

    // Wait for both the button state change and the search field to become hidden
    await Promise.all([
      expect(searchButton).toHaveAttribute('data-state', 'closed', { timeout: 5000 }),
      expect(this.page.getByRole('searchbox')).toBeHidden({ timeout: 5000 }),
    ]);
  }

  async getSearchField() {
    return this.page.getByRole('searchbox');
  }

  async searchRooms(searchTerm: string): Promise<void> {
    await this.openSearch();
    const searchField = await this.getSearchField();
    await expect(searchField).toBeVisible();
    await searchField.fill(searchTerm);
    await this.page.waitForTimeout(this.timeouts.wait);
  }

  async clearSearch(): Promise<void> {
    const searchField = await this.getSearchField();
    await searchField.clear();
    await this.page.waitForTimeout(this.timeouts.wait);
  }

  async isSearchOpen(): Promise<boolean> {
    // Check both the button state and field visibility for more reliable detection
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    const buttonState = await searchButton.getAttribute('data-state');
    const searchField = await this.getSearchField();
    const fieldVisible = await searchField.isVisible();

    // Both should be consistent - if button says open, field should be visible
    return buttonState === 'open' && fieldVisible;
  }

  async getSearchValue(): Promise<string> {
    const searchField = await this.getSearchField();
    return await searchField.inputValue();
  }

  async verifySearchButtonState(expectedState: 'open' | 'closed'): Promise<void> {
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    await expect(searchButton).toHaveAttribute('data-state', expectedState, { timeout: 5000 });

    // Debug: Check what aria-expanded value we actually get
    const actualAriaExpanded = await searchButton.getAttribute('aria-expanded');
    console.log(`Debug: aria-expanded actual value: "${actualAriaExpanded}", expected state: "${expectedState}"`);

    // React sets aria-expanded to boolean values, which become strings in HTML
    const ariaExpanded = expectedState === 'open' ? 'true' : 'false';
    await expect(searchButton).toHaveAttribute('aria-expanded', ariaExpanded, { timeout: 5000 });
  }

  async verifySearchFieldAccessibility(): Promise<void> {
    const searchField = await this.getSearchField();
    await expect(searchField).toHaveAttribute('aria-label');
  }

  async verifySearchPlaceholder(): Promise<void> {
    const searchField = await this.getSearchField();
    const placeholder = await searchField.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder?.length).toBeGreaterThan(0);
  }

  // Sort functionality
  async openSort(): Promise<void> {
    const sortButton = this.page.getByTestId(this.selectors.sortButton);
    await expect(sortButton).toBeVisible();

    // Check if already open to avoid unnecessary clicks
    const currentState = await sortButton.getAttribute('data-state');
    if (currentState === 'open') {
      return;
    }

    // Check if search is currently open and empty (it should close when sort opens)
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    const searchState = await searchButton.getAttribute('data-state');
    const shouldSearchClose = searchState === 'open';

    let searchValue = '';
    if (shouldSearchClose) {
      try {
        const searchField = await this.getSearchField();
        searchValue = await searchField.inputValue();
      } catch {
        // Search field might not be accessible, treat as empty
        searchValue = '';
      }
    }

    await sortButton.click();

    // Wait for the sort state to change to open
    await expect(sortButton).toHaveAttribute('data-state', 'open', { timeout: 5000 });

    // If search was open and empty, wait for it to close
    if (shouldSearchClose && searchValue.trim() === '') {
      await expect(searchButton).toHaveAttribute('data-state', 'closed', { timeout: 5000 });
    }
  }

  async closeSort(): Promise<void> {
    const sortButton = this.page.getByTestId(this.selectors.sortButton);

    // Check if already closed to avoid unnecessary clicks
    const currentState = await sortButton.getAttribute('data-state');
    if (currentState === 'closed') {
      return;
    }

    await sortButton.click();
    // Wait for the sort state to change to closed
    await expect(sortButton).toHaveAttribute('data-state', 'closed', { timeout: 5000 });
  }

  async getSortSelect() {
    return this.page.getByTestId(this.selectors.sortSelect);
  }

  async selectSortOption(option: keyof typeof this.selectors.sortOptions): Promise<void> {
    const sortSelect = await this.getSortSelect();
    await expect(sortSelect).toBeVisible();
    await sortSelect.click();

    const optionElement = this.page.getByTestId(this.selectors.sortOptions[option]);
    await expect(optionElement).toBeVisible();
    await optionElement.click();
  }

  async getCurrentSortValue(): Promise<string> {
    const sortSelect = await this.getSortSelect();
    return await sortSelect.locator('input').inputValue();
  }

  async toggleSortDirection(): Promise<void> {
    const sortDirectionButton = this.page.getByTestId(this.selectors.sortDirectionButton);
    await expect(sortDirectionButton).toBeVisible();
    await sortDirectionButton.click();
    await this.page.waitForTimeout(200);
  }

  async getSortDirection(): Promise<string> {
    const sortDirectionButton = this.page.getByTestId(this.selectors.sortDirectionButton);
    return (await sortDirectionButton.getAttribute('data-sort-direction')) || 'asc';
  }

  async verifySortButtonState(expectedState: 'open' | 'closed'): Promise<void> {
    const sortButton = this.page.getByTestId(this.selectors.sortButton);
    await expect(sortButton).toHaveAttribute('data-state', expectedState, { timeout: 5000 });

    // Wait for aria-expanded to be updated as well - it might lag behind data-state
    const expectedAriaExpanded = expectedState === 'open' ? 'true' : 'false';

    try {
      await expect(sortButton).toHaveAttribute('aria-expanded', expectedAriaExpanded, { timeout: 5000 });
    } catch (error) {
      // Debug: Check what aria-expanded value we actually get
      const actualAriaExpanded = await sortButton.getAttribute('aria-expanded');
      const actualDataState = await sortButton.getAttribute('data-state');

      throw new Error(
        `Sort button aria-expanded mismatch. Expected: "${expectedAriaExpanded}", Got: "${actualAriaExpanded}". ` +
          `data-state: "${actualDataState}". Original error: ${error}`
      );
    }
  }

  async verifySortDirection(expectedDirection: 'asc' | 'desc'): Promise<void> {
    const sortButton = this.page.getByTestId(this.selectors.sortButton);
    await expect(sortButton).toHaveAttribute('data-sort-direction', expectedDirection);

    const sortDirectionButton = this.page.getByTestId(this.selectors.sortDirectionButton);
    await expect(sortDirectionButton).toHaveAttribute('data-sort-direction', expectedDirection);
  }

  async verifyAllSortOptionsVisible(): Promise<void> {
    const sortSelect = await this.getSortSelect();
    await sortSelect.click();

    const expectedOptions = Object.values(this.selectors.sortOptions);
    for (const optionTestId of expectedOptions) {
      const optionElement = this.page.getByTestId(optionTestId);
      await expect(optionElement).toBeVisible();
    }
  }

  // Results functionality
  async getRoomCards() {
    return this.page.getByTestId(this.selectors.roomCardItem);
  }

  async getRoomCount(): Promise<number> {
    const roomCards = await this.getRoomCards();
    return await roomCards.count();
  }

  async getRoomTexts(): Promise<string[]> {
    const roomCards = await this.getRoomCards();
    return await roomCards.allTextContents();
  }

  async getRoomTitles(): Promise<string[]> {
    const roomCards = await this.getRoomCards();
    const titles: string[] = [];
    const count = await roomCards.count();

    for (let i = 0; i < count; i++) {
      const roomCard = roomCards.nth(i);
      const titleElement = roomCard.locator('h3'); // Typography variant="h3" contains room name
      const title = await titleElement.textContent();
      if (title) {
        titles.push(title);
      }
    }

    return titles;
  }

  async getFirstRoomText(): Promise<string | null> {
    const roomCards = await this.getRoomCards();
    const count = await roomCards.count();
    if (count === 0) return null;
    return await roomCards.nth(0).textContent();
  }

  async verifyEmptyState(): Promise<void> {
    const emptyState = this.page.getByTestId(this.selectors.emptyState);
    await expect(emptyState).toBeVisible();
  }

  async verifyErrorState(): Promise<void> {
    const errorState = this.page.locator('[data-testid="error-state"], [data-testid="empty-state"]');
    await expect(errorState.first()).toBeVisible();
  }

  async verifyRoomsContainText(searchTerm: string): Promise<void> {
    const roomTexts = await this.getRoomTexts();
    for (const text of roomTexts) {
      expect(text.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  }

  async verifyRoomsSortedAlphabetically(): Promise<void> {
    const roomTitles = await this.getRoomTitles();
    if (roomTitles.length <= 1) return;

    for (let i = 0; i < roomTitles.length - 1; i++) {
      const current = roomTitles[i].toLowerCase();
      const next = roomTitles[i + 1].toLowerCase();
      expect(current <= next).toBe(true);
    }
  }

  // Combined search and sort
  async searchAndSort(searchTerm: string, sortOption: keyof typeof this.selectors.sortOptions): Promise<void> {
    await this.searchRooms(searchTerm);
    await this.openSort();
    await this.selectSortOption(sortOption);
    await this.page.waitForTimeout(this.timeouts.wait);
  }

  // Mobile/responsive helpers
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  // Network simulation helpers
  async simulateNetworkError(): Promise<void> {
    await this.page.route('**/api/rooms*', (route) => route.abort());
  }

  // Keyboard navigation helpers
  async focusSearchButton(): Promise<void> {
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    await searchButton.focus();
  }

  async pressEscapeOnSearch(): Promise<void> {
    const searchField = await this.getSearchField();
    await searchField.focus();
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
  }

  async pressEnterOnSearchButton(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  async verifySearchButtonFocused(): Promise<void> {
    const searchButton = this.page.getByTestId(this.selectors.searchButton);
    await expect(searchButton).toBeFocused();
  }

  async verifySearchFieldFocused(): Promise<void> {
    const searchField = await this.getSearchField();
    await expect(searchField).toBeFocused();
  }
}

export async function createRoomSearchSortPage(page: Page): Promise<RoomSearchSortPage> {
  return new RoomSearchSortPage(page);
}
