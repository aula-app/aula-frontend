import { Page } from '@playwright/test';
import { BoxData } from '../../fixtures/ideas';
import * as fixtures from '../../fixtures/users';
import { TestDataBuilder } from '../base-test';
import * as shared from '../shared';
import * as rooms from '../interactions/rooms';
import * as ideas from '../interactions/ideas';
import * as boxes from '../interactions/boxes';

export interface VotingWorkflowTestContext {
  room: any;
  data: {
    tempScope: string;
    alicesIdea: any;
    bobsIdea: any;
    box: BoxData;
    isRoomCreated?: boolean;
    isBoxCreated?: boolean;
    isInVotingPhase?: boolean;
    isDelegationActive?: boolean;
    isCompleted?: boolean;
  };
}

export class VotingWorkflowTestHelpers {
  static async setupVotingWorkflowTest(): Promise<VotingWorkflowTestContext> {
    const tempScope = 'fullflow';
    const room = TestDataBuilder.createRoom();

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during testing data',
    };

    const bobsIdea = {
      name: 'bobs-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during testing data',
    };

    const box: BoxData = {
      name: 'admins-test-box' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during automated testing',
      ideas: [alicesIdea, bobsIdea],
      discussionDays: 6,
      votingDays: 10,
      phase: 10,
    };

    return {
      room,
      data: {
        tempScope,
        alicesIdea,
        bobsIdea,
        box,
        isRoomCreated: false,
        isBoxCreated: false,
        isInVotingPhase: false,
        isDelegationActive: false,
        isCompleted: false,
      },
    };
  }

  static async createRoomAndIdeas(
    page: Page,
    context: VotingWorkflowTestContext,
    alicePage: Page,
    bobPage: Page
  ): Promise<void> {
    await rooms.create(page, context.room);
    context.data.isRoomCreated = true;

    await ideas.create(alicePage, context.room, context.data.alicesIdea);
    await ideas.create(bobPage, context.room, context.data.bobsIdea);
  }

  static async createVotingBox(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    await boxes.create(page, context.room, context.data.box);
    context.data.isBoxCreated = true;
  }

  static async moveBoxToPhase(
    page: Page,
    context: VotingWorkflowTestContext,
    fromPhase: number,
    toPhase: number
  ): Promise<void> {
    await boxes.move(page, context.room, context.data.box, fromPhase, toPhase);

    if (toPhase === 30) {
      // ABSTIMMUNG phase
      context.data.isInVotingPhase = true;
    } else if (toPhase === 40) {
      // RESULTS phase
      context.data.isCompleted = true;
    }
  }

  static async approveIdeas(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    await ideas.approve(page, context.room, context.data.box, context.data.alicesIdea);
    await ideas.approve(page, context.room, context.data.box, context.data.bobsIdea);
  }

  static async castVotes(
    alicePage: Page,
    bobPage: Page,
    rainerPage: Page,
    context: VotingWorkflowTestContext
  ): Promise<void> {
    await ideas.vote(alicePage, context.room, context.data.box, context.data.alicesIdea, 'for');
    await ideas.vote(alicePage, context.room, context.data.box, context.data.bobsIdea, 'against');
    await ideas.vote(bobPage, context.room, context.data.box, context.data.alicesIdea, 'for');
    await ideas.vote(bobPage, context.room, context.data.box, context.data.bobsIdea, 'for');
    await ideas.vote(rainerPage, context.room, context.data.box, context.data.alicesIdea, 'against');
  }

  static async delegateVotes(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    await boxes.delegateVotes(page, context.room, context.data.box, fixtures.mallory);
    context.data.isDelegationActive = true;
  }

  static async undelegateVotes(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    await boxes.unDelegateVotes(page, context.room, context.data.box);
    context.data.isDelegationActive = false;
  }

  static async checkDelegatedVotes(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    await boxes.hasDelegatedVotes(page, context.room, context.data.box);
  }

  static async voteWithDelegation(
    page: Page,
    context: VotingWorkflowTestContext
  ): Promise<{ before: number; after: number }> {
    const beforeCount = await ideas.totalVoteCount(page, context.room, context.data.box, context.data.alicesIdea);
    await ideas.vote(page, context.room, context.data.box, context.data.alicesIdea, 'for');
    const afterCount = await ideas.totalVoteCount(page, context.room, context.data.box, context.data.alicesIdea);

    return { before: beforeCount, after: afterCount };
  }

  static async getVoteCounts(page: Page, context: VotingWorkflowTestContext): Promise<[number, number, number]> {
    return await ideas.voteCounts(page, context.room, context.data.box, context.data.alicesIdea);
  }

  static async cleanupTestData(page: Page, context: VotingWorkflowTestContext): Promise<void> {
    const errors: Error[] = [];

    // Clean up in reverse order: box first, then ideas, then room
    if (context.room && context.data.box && context.data.isBoxCreated) {
      try {
        await this.cleanupBox(page, context.room, context.data.box);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup box: ${e.message}`));
      }
    }

    if (context.room && context.data.alicesIdea) {
      try {
        await this.cleanupIdea(page, context.room, context.data.alicesIdea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup Alice's idea: ${e.message}`));
      }
    }

    if (context.room && context.data.bobsIdea) {
      try {
        await this.cleanupIdea(page, context.room, context.data.bobsIdea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup Bob's idea: ${e.message}`));
      }
    }

    if (context.room && context.data.isRoomCreated) {
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

  private static async cleanupBox(page: Page, room: any, box: BoxData): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await boxes.remove(page, room, box);
    } catch (e) {
      throw e; // Re-throw to be caught by caller
    }
  }

  private static async cleanupIdea(page: Page, room: any, idea: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await ideas.remove(page, room, idea);
    } catch (e) {
      throw e; // Re-throw to be caught by caller
    }
  }

  private static async cleanupRoom(page: Page, room: any): Promise<void> {
    try {
      await page.goto(shared.getHost());
      await rooms.remove(page, room);
    } catch (e) {
      throw e; // Re-throw to be caught by caller
    }
  }

  static async executeWithCleanup<T>(
    page: Page,
    testLogic: (context: VotingWorkflowTestContext) => Promise<T>,
    emergencyCleanupQueue?: Array<{ page: any; context: VotingWorkflowTestContext }>
  ): Promise<T> {
    const context = await this.setupVotingWorkflowTest();

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
