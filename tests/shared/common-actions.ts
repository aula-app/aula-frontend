/**
 * Common test actions that are used across multiple tests
 * These helpers reduce repetitive code and improve maintainability
 */

import { Page } from '@playwright/test';
import * as browsers from './interactions/browsers';
import * as rooms from './interactions/rooms';
import * as ideas from './interactions/ideas';
import * as shared from './shared';

/**
 * Browser management helpers
 */
export class BrowserHelpers {
  /**
   * Opens a new page for a specific user role using stored authentication states
   */
  static async openPageForUser(userType: 'admin' | 'alice' | 'bob' | 'mallory' | 'rainer' | 'burt'): Promise<Page> {
    // Import dynamically to avoid circular dependencies
    const { AuthHelpers } = await import('./auth-helpers');
    const { getHost } = await import('./shared');
    const { page } = await AuthHelpers.createAuthenticatedPage(userType);

    // Navigate to the homepage to ensure the user is properly logged in
    await page.goto(getHost());

    return page;
  }

  /**
   * Closes page safely with error handling
   */
  static async closePage(page: Page) {
    try {
      // Also close the context if this is an auth-state created page
      const context = page.context();
      await page.close();
      await context.close();
    } catch (error) {
      console.warn('Failed to close page:', error);
    }
  }
}

/**
 * Room workflow helpers
 */
export class RoomWorkflows {
  /**
   * Complete room setup: create room and navigate to it
   */
  static async setupAndNavigateToRoom(page: Page, roomData: any) {
    await rooms.create(page, roomData);
    await page.goto(shared.getHost());
    await ideas.goToRoom(page, roomData);
  }

  /**
   * Create room with ideas for testing
   */
  static async createRoomWithIdeas(page: Page, roomData: any, ideasData: any[]) {
    await this.setupAndNavigateToRoom(page, roomData);

    for (const idea of ideasData) {
      await ideas.create(page, roomData, idea);
    }
  }
}

/**
 * Idea workflow helpers
 */
export class IdeaWorkflows {
  /**
   * Create and verify idea exists
   */
  static async createAndVerifyIdea(page: Page, roomData: any, ideaData: any) {
    await ideas.create(page, roomData, ideaData);
    // Add verification logic here if needed
  }

  /**
   * Clean up idea (delete)
   */
  static async cleanupIdea(page: Page, roomData: any, ideaData: any) {
    try {
      await ideas.remove(page, roomData, ideaData);
    } catch (error) {
      console.warn('Failed to cleanup idea:', ideaData.name, error);
    }
  }

  /**
   * Create multiple ideas at once
   */
  static async createMultipleIdeas(page: Page, roomData: any, ideasData: any[]) {
    for (const idea of ideasData) {
      await this.createAndVerifyIdea(page, roomData, idea);
    }
  }
}

/**
 * Test cleanup helpers
 */
export class CleanupHelpers {
  /**
   * Clean up test data for a specific scope
   */
  static async cleanupTestScope(pages: Page[], roomData: any, ideasData: any[] = []) {
    // Close all pages
    for (const page of pages) {
      await BrowserHelpers.closePage(page);
    }

    // Additional cleanup logic can be added here
    // For example, API calls to clean up database state
  }

  /**
   * Safe async cleanup that doesn't throw errors
   */
  static async safeCleanup(cleanupFunctions: Array<() => Promise<void>>) {
    for (const cleanup of cleanupFunctions) {
      try {
        await cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    }
  }
}
