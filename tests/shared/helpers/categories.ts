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
      categoriesPage
    };
  }

  static async createCategoryWithIdea(
    page: Page, 
    categoryName: string
  ): Promise<{ testRoom: any; testIdea: any }> {
    const testIdea = TestDataBuilder.createIdea('with-category');
    testIdea.category = categoryName;
    const testRoom = TestDataBuilder.createRoom('category-test', [fixtures.alice, fixtures.bob]);

    await page.goto(shared.getHost());
    await rooms.create(page, testRoom);
    await ideas.create(page, testRoom, testIdea);
    
    return { testRoom, testIdea };
  }

  static async cleanupTestData(
    page: Page, 
    context: CategoryTestContext
  ): Promise<void> {
    const cleanupTasks = [];

    if (context.testRoom && context.testIdea) {
      cleanupTasks.push(
        this.cleanupIdea(page, context.testRoom, context.testIdea)
      );
    }

    cleanupTasks.push(
      context.categoriesPage.cleanupCategory(context.categoryName)
    );

    await Promise.allSettled(cleanupTasks);
  }

  private static async cleanupIdea(
    page: Page, 
    testRoom: any, 
    testIdea: any
  ): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await ideas.remove(page, testRoom, testIdea);
    } catch (e) {
      // Failed to cleanup test idea - this is expected in some cases
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: CategoryTestContext) => Promise<T>
  ): Promise<T> {
    const context = await this.setupCategoryTest(page);
    
    try {
      return await testLogic(context);
    } finally {
      await this.cleanupTestData(page, context);
    }
  }
}