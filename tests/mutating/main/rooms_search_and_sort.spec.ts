import { test, expect } from '@playwright/test';
import * as shared from '../../shared/shared';
import * as fixtures from '../../fixtures/users';
import * as browsers from '../../shared/page_interactions/browsers';

// force these tests to run sequentially
test.describe.configure({ mode: 'serial' });

test.describe('Rooms View - Search and Sort Functionality', () => {
  test.beforeAll(async () => {
    fixtures.init();
  });

  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  test.describe('Search Functionality', () => {
    test('should open search field when search button is clicked', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await expect(searchButton).toBeVisible();

      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();
      await expect(searchField).toBeFocused();

      await page.close();
    });

    test('should close search field when close button is clicked', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      await searchButton.click();
      await expect(searchField).toBeHidden();

      await page.close();
    });

    test('should filter rooms based on room name search', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      // Get initial room count
      const allRoomCards = page.getByTestId('room-card-item');
      const initialCount = await allRoomCards.count();

      if (initialCount === 0) {
        await page.close();
        return; // Skip if no rooms exist
      }

      // Get the first few characters from the first room's name
      const firstRoomText = await allRoomCards.nth(0).textContent();
      if (!firstRoomText) {
        await page.close();
        return;
      }

      // Use first 3 characters as search term (language agnostic)
      const searchTerm = firstRoomText.trim().substring(0, 3).toLowerCase();

      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      await searchField.fill(searchTerm);
      await page.waitForTimeout(500);

      const roomCards = page.getByTestId('room-card-item');
      const visibleCards = await roomCards.count();

      if (visibleCards > 0) {
        const roomTexts = await roomCards.allTextContents();
        roomTexts.forEach((text) => {
          expect(text.toLowerCase()).toContain(searchTerm);
        });
        // Should have filtered results (less than or equal to initial count)
        expect(visibleCards).toBeLessThanOrEqual(initialCount);
      }

      await page.close();
    });

    test('should show empty state when no rooms match search', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill('nonexistentroom12345');
      await page.waitForTimeout(500);

      const emptyState = page.getByTestId('empty-state');
      await expect(emptyState).toBeVisible();

      await page.close();
    });

    test('should clear search and show all rooms when search is cleared', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill('test');
      await page.waitForTimeout(500);

      const filteredCount = await page.getByTestId('room-card-item').count();

      await searchField.clear();
      await page.waitForTimeout(500);

      const allCount = await page.getByTestId('room-card-item').count();
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);

      await page.close();
    });

    test('should have placeholder text when search is opened', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      const placeholder = await searchField.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder?.length).toBeGreaterThan(0);

      await page.close();
    });

    test('should have proper button states and accessibility', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');

      // Initially closed
      await expect(searchButton).toHaveAttribute('data-state', 'closed');
      await expect(searchButton).toHaveAttribute('aria-expanded', 'false');

      await searchButton.click();

      // After opening
      await expect(searchButton).toHaveAttribute('data-state', 'open');
      await expect(searchButton).toHaveAttribute('aria-expanded', 'true');

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toHaveAttribute('aria-label');

      await page.close();
    });
  });

  test.describe('Sort Functionality', () => {
    test('should open sort panel when sort button is clicked', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');
      await expect(sortButton).toBeVisible();

      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await expect(sortSelect).toBeVisible();

      await page.close();
    });

    test('should close sort panel when close button is clicked', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await expect(sortSelect).toBeVisible();

      await sortButton.click();
      await expect(sortSelect).toBeHidden();

      await page.close();
    });

    test('should change sort option when different sort is selected', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await expect(sortSelect).toBeVisible();

      await sortSelect.click();

      const nameOption = page.getByTestId('sort-option-room_name');
      await expect(nameOption).toBeVisible();
      await nameOption.click();

      // For MUI Select, we need to get the input element inside the select
      const selectedValue = await sortSelect.locator('input').inputValue();
      expect(selectedValue).toBe('room_name');

      await page.close();
    });

    test('should toggle sort direction when direction button is clicked', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortDirectionButton = page.getByTestId('sort-direction-button');
      await expect(sortDirectionButton).toBeVisible();

      const initialDirection = await sortDirectionButton.getAttribute('data-sort-direction');
      expect(initialDirection).toBe('asc'); // Default direction

      await sortDirectionButton.click();
      await page.waitForTimeout(200);

      const newDirection = await sortDirectionButton.getAttribute('data-sort-direction');
      expect(newDirection).toBe('desc');

      await page.close();
    });

    test('should show different sort options in dropdown', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await sortSelect.click();

      const expectedOptions = ['order_importance', 'room_name', 'created', 'last_update'];

      for (const optionValue of expectedOptions) {
        const optionElement = page.getByTestId(`sort-option-${optionValue}`);
        await expect(optionElement).toBeVisible();
      }

      await page.close();
    });

    test('should have proper sort control states and accessibility', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');

      // Initially closed with asc direction
      await expect(sortButton).toHaveAttribute('data-state', 'closed');
      await expect(sortButton).toHaveAttribute('data-sort-direction', 'asc');

      await sortButton.click();

      // After opening
      await expect(sortButton).toHaveAttribute('data-state', 'open');

      const sortSelect = page.getByTestId('sort-select');
      await expect(sortSelect).toBeVisible();

      const sortDirectionButton = page.getByTestId('sort-direction-button');
      await expect(sortDirectionButton).toHaveAttribute('data-sort-direction', 'asc');

      await page.close();
    });

    test('should update sort direction when toggled', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      const sortButton = page.getByTestId('sort-button');

      // Initially asc direction
      await expect(sortButton).toHaveAttribute('data-sort-direction', 'asc');

      await sortButton.click();
      const sortDirectionButton = page.getByTestId('sort-direction-button');
      await sortDirectionButton.click();
      await page.waitForTimeout(200);

      // After toggling, should be desc
      await expect(sortButton).toHaveAttribute('data-sort-direction', 'desc');
      await expect(sortDirectionButton).toHaveAttribute('data-sort-direction', 'desc');

      await page.close();
    });
  });

  test.describe('Combined Search and Sort', () => {
    test('should maintain search query when changing sort options', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill('test');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await sortSelect.click();
      await page.getByTestId('sort-option-room_name').click();

      const searchValue = await searchField.inputValue();
      expect(searchValue).toBe('test');

      await page.close();
    });

    test('should close search when sort is opened and search is empty', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      await expect(searchField).toBeHidden();

      await page.close();
    });

    test('should keep search open when sort is opened and search has value', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill('test');

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      await expect(searchField).toBeVisible();
      expect(await searchField.inputValue()).toBe('test');

      await page.close();
    });

    test('should apply both search and sort filters together', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');

      // Get initial room count and first room text
      const allRoomCards = page.getByTestId('room-card-item');
      const initialCount = await allRoomCards.count();

      if (initialCount === 0) {
        await page.close();
        return; // Skip if no rooms exist
      }

      const firstRoomText = await allRoomCards.nth(0).textContent();
      if (!firstRoomText) {
        await page.close();
        return;
      }

      // Use first 3 characters as search term (language agnostic)
      const searchTerm = firstRoomText.trim().substring(0, 3).toLowerCase();

      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill(searchTerm);
      await page.waitForTimeout(500);

      const sortButton = page.getByTestId('sort-button');
      await sortButton.click();

      const sortSelect = page.getByTestId('sort-select');
      await sortSelect.click();
      await page.getByTestId('sort-option-room_name').click();

      await page.waitForTimeout(500);

      const roomCards = page.getByTestId('room-card-item');
      const visibleCards = await roomCards.count();

      if (visibleCards > 1) {
        const firstCardText = await roomCards.nth(0).textContent();
        const secondCardText = await roomCards.nth(1).textContent();

        expect(firstCardText?.toLowerCase()).toContain(searchTerm);
        expect(secondCardText?.toLowerCase()).toContain(searchTerm);

        if (firstCardText && secondCardText) {
          expect(firstCardText.toLowerCase() <= secondCardText.toLowerCase()).toBe(true);
        }
      }

      await page.close();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation for search', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');

      await searchButton.focus();

      await expect(searchButton).toBeFocused();

      await page.keyboard.press('Enter');

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeFocused();

      await page.close();
    });

    test('should support escape key to close search', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      await searchField.focus();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      await expect(searchField).toBeHidden();

      await page.close();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      await page.setViewportSize({ width: 375, height: 667 });

      const searchButton = page.getByTestId('search-button');
      await expect(searchButton).toBeVisible();

      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      const sortButton = page.getByTestId('sort-button');
      await expect(sortButton).toBeVisible();

      await page.close();
    });

    test('should maintain functionality on tablet viewport', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      await page.setViewportSize({ width: 768, height: 1024 });

      const searchButton = page.getByTestId('search-button');
      const sortButton = page.getByTestId('sort-button');

      await expect(searchButton).toBeVisible();
      await expect(sortButton).toBeVisible();

      await searchButton.click();
      const searchField = page.getByRole('searchbox');
      await expect(searchField).toBeVisible();

      await sortButton.click();
      const sortSelect = page.getByTestId('sort-select');
      await expect(sortSelect).toBeVisible();

      await page.close();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully during search', async () => {
      const page = await browsers.newPage(browsers.admins_browser);
      const host = shared.getHost();
      await page.goto(host || 'http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      await page.route('**/api/rooms*', (route) => route.abort());

      const searchButton = page.getByTestId('search-button');
      await searchButton.click();

      const searchField = page.getByRole('searchbox');
      await searchField.fill('test');

      // Check for error state component or empty state when network fails
      const errorOrEmptyState = page.locator('[data-testid="error-state"], [data-testid="empty-state"]');
      await expect(errorOrEmptyState.first()).toBeVisible();

      await page.close();
    });
  });
});
