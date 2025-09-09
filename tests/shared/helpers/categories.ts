import { Page } from '@playwright/test';
import { CategoriesPage } from '../page_interactions/categories';
import { TestDataBuilder } from '../base-test';
import * as shared from '../shared';
import * as rooms from '../page_interactions/rooms';
import * as ideas from '../page_interactions/ideas';
import * as fixtures from '../../fixtures/users';

export interface CategoryTestContext {
  categoryName: string;
  categoriesPage: CategoriesPage;
  testRoom?: any;
  testIdea?: any;
}

export class CategoryTestHelpers {
  static generateCategoryName(): string {
    return 'TESTING' + shared.gensym();
  }

  static async setupCategoryTest(page: Page): Promise<CategoryTestContext> {
    const categoryName = this.generateCategoryName();
    const categoriesPage = new CategoriesPage(page);

    return {
      categoryName,
      categoriesPage,
    };
  }

  static async createCategoryWithIdea(page: Page, categoryName: string): Promise<{ testRoom: any; testIdea: any }> {
    const testIdea = TestDataBuilder.createIdea('with-category');
    (testIdea as any).category = categoryName; // Type assertion for dynamic property
    const testRoom = TestDataBuilder.createRoom('category-test', [fixtures.alice, fixtures.bob]);

    await page.goto(shared.getHost());
    await rooms.create(page, testRoom);
    await ideas.create(page, testRoom, testIdea);

    return { testRoom, testIdea };
  }

  static async cleanupTestData(page: Page, context: CategoryTestContext): Promise<void> {
    const errors: Error[] = [];

    // Clean up in reverse order: idea first, then room, then category
    if (context.testRoom && context.testIdea) {
      try {
        await this.cleanupIdea(page, context.testRoom, context.testIdea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup idea: ${e.message}`));
      }
    }

    if (context.testRoom) {
      try {
        await this.cleanupRoom(page, context.testRoom);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup room: ${e.message}`));
      }
    }

    try {
      await context.categoriesPage.cleanupCategory(context.categoryName);
    } catch (e: any) {
      errors.push(new Error(`Failed to cleanup category: ${e.message}`));
    }

    // Log cleanup errors but don't fail the test
    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  }

  private static async cleanupIdea(page: Page, testRoom: any, testIdea: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await ideas.remove(page, testRoom, testIdea);
    } catch (e) {
      // Failed to cleanup test idea - this is expected in some cases
      throw e; // Re-throw to be caught by caller
    }
  }

  private static async cleanupRoom(page: Page, testRoom: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await rooms.remove(page, testRoom);
    } catch (e) {
      // Failed to cleanup test room - this is expected in some cases
      throw e; // Re-throw to be caught by caller
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: CategoryTestContext) => Promise<T>,
    emergencyCleanupQueue?: Array<{ page: any; context: CategoryTestContext }>
  ): Promise<T> {
    const context = await this.setupCategoryTest(page);

    // Add to emergency cleanup queue if provided
    if (emergencyCleanupQueue) {
      emergencyCleanupQueue.push({ page, context });
    }

    try {
      return await testLogic(context);
    } finally {
      // Remove from emergency cleanup queue if successful
      if (emergencyCleanupQueue) {
        const index = emergencyCleanupQueue.findIndex((item) => item.context === context);
        if (index >= 0) {
          emergencyCleanupQueue.splice(index, 1);
        }
      }

      await this.cleanupTestData(page, context);
    }
  }

  // Additional utility for force cleanup of specific resources
  static async forceCleanupCategory(page: Page, categoryName: string): Promise<void> {
    try {
      const categoriesPage = new CategoriesPage(page);
      await categoriesPage.cleanupCategory(categoryName);
    } catch (e) {
      console.warn(`Failed to force cleanup category ${categoryName}:`, e);
    }
  }
}
