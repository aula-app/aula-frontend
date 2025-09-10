import { Page } from '@playwright/test';
import { TestDataBuilder } from '../base-test';
import * as shared from '../shared';
import * as rooms from '../interactions/rooms';
import * as ideas from '../interactions/ideas';
import * as ui from '../interactions/interface';

export interface ReportingTestContext {
  room: any;
  data: {
    [k: string]: any;
    isIdeaReported?: boolean;
    isCommentCreated?: boolean;
    isCommentReported?: boolean;
    isBugReported?: boolean;
  };
}

export class ReportingTestHelpers {
  static async setupReportingTest(): Promise<ReportingTestContext> {
    const room = TestDataBuilder.createRoom('reporting');
    const data: { [k: string]: any } = {};

    return {
      room,
      data,
    };
  }

  static async createRoomWithUsers(page: Page, room: any): Promise<void> {
    await rooms.create(page, room);
  }

  static async createIdeaForTesting(page: Page, room: any, data: any): Promise<void> {
    data.alicesIdea = TestDataBuilder.createIdea('reporting-scope-3');
    await ideas.create(page, room, data.alicesIdea);
  }

  static async reportIdea(page: Page, room: any, idea: any, reportType: string): Promise<void> {
    await ideas.report(page, room, idea, reportType);
  }

  static async checkIdeaReport(page: Page, idea: any): Promise<void> {
    await ideas.checkReport(page, idea);
  }

  static async addComment(page: Page, room: any, idea: any, commentText: string): Promise<void> {
    await ideas.comment(page, room, idea, commentText);
  }

  static async reportComment(page: Page, room: any, idea: any, commentText: string, reportType: string): Promise<void> {
    await ideas.reportComment(page, room, idea, commentText, reportType);
  }

  static async checkCommentReport(page: Page, commentText: string): Promise<void> {
    await ideas.checkCommentReport(page, commentText);
  }

  static async reportBug(page: Page, bugDescription: string): Promise<void> {
    await ui.reportBug(page, bugDescription);
  }

  static async checkBugReport(page: Page, bugDescription: string): Promise<void> {
    await ui.checkReport(page, bugDescription);
  }

  static async cleanupTestData(page: Page, context: ReportingTestContext): Promise<void> {
    const errors: Error[] = [];

    // Clean up in reverse order: ideas first, then room
    if (context.room && context.data.alicesIdea) {
      try {
        await this.cleanupIdea(page, context.room, context.data.alicesIdea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup idea: ${e.message}`));
      }
    }

    if (context.room) {
      try {
        await this.cleanupRoom(page, context.room);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup room: ${e.message}`));
      }
    }

    // Log cleanup errors but don't fail the test
    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  }

  private static async cleanupIdea(page: Page, room: any, idea: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await ideas.remove(page, room, idea);
    } catch (e) {
      // Failed to cleanup test idea - this is expected in some cases
      throw e; // Re-throw to be caught by caller
    }
  }

  private static async cleanupRoom(page: Page, room: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await rooms.remove(page, room);
    } catch (e) {
      // Failed to cleanup test room - this is expected in some cases
      throw e; // Re-throw to be caught by caller
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: ReportingTestContext) => Promise<T>,
    emergencyCleanupQueue?: Array<{ page: any; context: ReportingTestContext }>
  ): Promise<T> {
    const context = await this.setupReportingTest();

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
}
