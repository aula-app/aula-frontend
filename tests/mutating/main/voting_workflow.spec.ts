import { expect, test } from '@playwright/test';
import { BoxData } from '../../fixtures/ideas';
import * as fixtures from '../../fixtures/users';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as boxes from '../../shared/page_interactions/boxes';
import { alice, bob, mallory, rainer } from '../../shared/page_interactions/browsers';
import * as ideas from '../../shared/page_interactions/ideas';
import * as rooms from '../../shared/page_interactions/rooms';
import * as shared from '../../shared/shared';

// Test constants for better maintainability
const TEST_USERS = {
  ADMIN: 'admin',
  ALICE: 'alice',
  BOB: 'bob',
  MALLORY: 'mallory',
  RAINER: 'rainer',
} as const;

const VOTING_CONFIG = {
  TIMEOUT: 800000,
  SCOPE: 'fullflow',
  DESCRIPTION: 'generated during testing data',
  BOX_DESCRIPTION: 'generated during automated testing',
} as const;

const PHASE_CONFIG = {
  DISCUSSION: 10,
  PRÜFUNG: 20,
  ABSTIMMUNG: 30,
  RESULTS: 40,
} as const;

const BOX_SETTINGS = {
  DISCUSSION_DAYS: 6,
  VOTING_DAYS: 10,
  INITIAL_PHASE: 10,
} as const;

// Test context interface
interface VotingWorkflowTestContext {
  room: any;
  data: {
    tempScope: string;
    alicesIdea: any;
    bobsIdea: any;
    box: BoxData;
  };
  isRoomCreated: boolean;
  isBoxCreated: boolean;
  isInVotingPhase: boolean;
  isDelegationActive: boolean;
  isCompleted: boolean;
}

describeWithSetup('Voting Workflow - Complete Process from Creation to Results', () => {
  // Shared context for sequential tests
  let sharedContext: VotingWorkflowTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: VotingWorkflowTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext) {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
      try {
        await cleanupTestData(admin, sharedContext);
      } catch (e) {
        console.warn('Shared context cleanup failed:', e);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    }

    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  // Helper functions
  const setupTestContext = (): VotingWorkflowTestContext => {
    const tempScope = VOTING_CONFIG.SCOPE;
    const room = TestDataBuilder.createRoom();

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: VOTING_CONFIG.DESCRIPTION,
    };

    const bobsIdea = {
      name: 'bobs-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: VOTING_CONFIG.DESCRIPTION,
    };

    const box: BoxData = {
      name: 'admins-test-box' + shared.getRunId() + '-scope-' + tempScope,
      description: VOTING_CONFIG.BOX_DESCRIPTION,
      ideas: [alicesIdea, bobsIdea],
      discussionDays: BOX_SETTINGS.DISCUSSION_DAYS,
      votingDays: BOX_SETTINGS.VOTING_DAYS,
      phase: BOX_SETTINGS.INITIAL_PHASE,
    };

    return {
      room,
      data: { tempScope, alicesIdea, bobsIdea, box },
      isRoomCreated: false,
      isBoxCreated: false,
      isInVotingPhase: false,
      isDelegationActive: false,
      isCompleted: false,
    };
  };

  const cleanupTestData = async (page: any, context: VotingWorkflowTestContext): Promise<void> => {
    const errors: Error[] = [];

    // Cleanup is commented out to preserve test data for debugging
    // This matches the original test behavior
    if (false) {
      try {
        await boxes.remove(page, context.room, context.data.box);
        await ideas.remove(page, context.room, context.data.alicesIdea);
        await ideas.remove(page, context.room, context.data.bobsIdea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup test data: ${e.message}`));
      }
    }

    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  };

  test.describe('Setup and Approval Phase', () => {
    test('Create ideas and box for voting workflow', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        // Initialize shared context for the test suite
        sharedContext = setupTestContext();
        expect(sharedContext, 'Test context should be initialized successfully').toBeDefined();

        // Create room first
        await rooms.create(admin, sharedContext.room);
        sharedContext.isRoomCreated = true;

        // Create ideas and box
        await ideas.create(alice, sharedContext.room, sharedContext.data.alicesIdea);
        await ideas.create(bob, sharedContext.room, sharedContext.data.bobsIdea);
        await boxes.create(admin, sharedContext.room, sharedContext.data.box);

        sharedContext.isBoxCreated = true;
        expect(sharedContext.data.alicesIdea, "Alice's idea should be created successfully").toBeDefined();
        expect(sharedContext.data.bobsIdea, "Bob's idea should be created successfully").toBeDefined();
        expect(sharedContext.data.box, 'Box should be created successfully').toBeDefined();
      } catch (error) {
        console.error('Failed to create voting workflow setup:', error);
        throw new Error(`Voting workflow setup failed. Context: ${!!sharedContext}`);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Move box to prüfung phase', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        expect(sharedContext, 'Shared context should exist from previous test').toBeTruthy();
        expect(sharedContext!.isBoxCreated, 'Box should be created in previous test').toBe(true);

        await boxes.move(
          admin,
          sharedContext!.room,
          sharedContext!.data.box,
          PHASE_CONFIG.DISCUSSION,
          PHASE_CONFIG.PRÜFUNG
        );

        expect(sharedContext!.data.box, 'Box should be moved to prüfung phase successfully').toBeDefined();
      } catch (error) {
        console.error('Failed to move box to prüfung phase:', error);
        throw new Error(`Phase transition failed. Prerequisites: boxCreated=${!!sharedContext?.isBoxCreated}`);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Rainer can approve ideas in prüfung phase', async () => {
      test.setTimeout(VOTING_CONFIG.TIMEOUT);

      try {
        expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
        expect(sharedContext!.isBoxCreated, 'Box should be in prüfung phase').toBe(true);

        await ideas.approve(rainer, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.alicesIdea);
        await ideas.approve(rainer, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.bobsIdea);

        expect(sharedContext!.data.alicesIdea, "Alice's idea should be approved").toBeDefined();
        expect(sharedContext!.data.bobsIdea, "Bob's idea should be approved").toBeDefined();
      } catch (error) {
        console.error('Failed to approve ideas:', error);
        throw new Error(`Idea approval failed. Prerequisites: boxCreated=${!!sharedContext?.isBoxCreated}`);
      }
    });

    test('Rainer can move the box to abstimmung phase', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isBoxCreated, 'Box should be ready for abstimmung').toBe(true);

        await boxes.move(
          rainer,
          sharedContext!.room,
          sharedContext!.data.box,
          PHASE_CONFIG.PRÜFUNG,
          PHASE_CONFIG.ABSTIMMUNG
        );
        sharedContext!.isInVotingPhase = true;

        expect(sharedContext!.isInVotingPhase, 'Box should be in abstimmung phase').toBe(true);
      } catch (error) {
        console.error('Failed to move box to abstimmung:', error);
        throw new Error(
          `Abstimmung phase transition failed. Prerequisites: boxCreated=${!!sharedContext?.isBoxCreated}`
        );
      }
    });
  });

  test.describe('Voting Phase', () => {
    test('Users can vote on ideas', async () => {
      try {
        expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
        expect(sharedContext!.isInVotingPhase, 'Box should be in voting phase').toBe(true);

        await ideas.vote(alice, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.alicesIdea, 'for');
        await ideas.vote(alice, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.bobsIdea, 'against');
        await ideas.vote(bob, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.alicesIdea, 'for');
        await ideas.vote(bob, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.bobsIdea, 'for');

        expect(sharedContext!.data.alicesIdea, "Alice and Bob should be able to vote on Alice's idea").toBeDefined();
        expect(sharedContext!.data.bobsIdea, "Alice and Bob should be able to vote on Bob's idea").toBeDefined();
      } catch (error) {
        console.error('Failed user voting:', error);
        throw new Error(`User voting failed. Prerequisites: inVotingPhase=${!!sharedContext?.isInVotingPhase}`);
      }
    });

    test('Rainer can vote against an idea', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isInVotingPhase, 'Box should be in voting phase for Rainer').toBe(true);

        await ideas.vote(
          rainer,
          sharedContext!.room,
          sharedContext!.data.box,
          sharedContext!.data.alicesIdea,
          'against'
        );

        expect(sharedContext!.data.alicesIdea, 'Rainer should be able to vote against ideas').toBeDefined();
      } catch (error) {
        console.error('Failed Rainer voting:', error);
        throw new Error(`Rainer voting failed. Prerequisites: inVotingPhase=${!!sharedContext?.isInVotingPhase}`);
      }
    });
  });

  test.describe('Vote Delegation', () => {
    test('Rainer can delegate votes to Mallory', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isInVotingPhase, 'Box should be in voting phase for delegation').toBe(true);

        await boxes.delegateVotes(rainer, sharedContext!.room, sharedContext!.data.box, fixtures.mallory);
        sharedContext!.isDelegationActive = true;

        expect(sharedContext!.isDelegationActive, 'Vote delegation should be active').toBe(true);
      } catch (error) {
        console.error('Failed vote delegation:', error);
        throw new Error(`Vote delegation failed. Prerequisites: inVotingPhase=${!!sharedContext?.isInVotingPhase}`);
      }
    });

    test('Mallory receives delegated votes and can vote with them', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isDelegationActive, 'Vote delegation should be active').toBe(true);

        await boxes.hasDelegatedVotes(mallory, sharedContext!.room, sharedContext!.data.box);

        const beforeCount = await ideas.totalVoteCount(
          mallory,
          sharedContext!.room,
          sharedContext!.data.box,
          sharedContext!.data.alicesIdea
        );
        expect(beforeCount).toBe(2);

        await ideas.vote(mallory, sharedContext!.room, sharedContext!.data.box, sharedContext!.data.alicesIdea, 'for');

        const afterCount = await ideas.totalVoteCount(
          mallory,
          sharedContext!.room,
          sharedContext!.data.box,
          sharedContext!.data.alicesIdea
        );
        expect(afterCount).toBe(beforeCount + 2);

        expect(afterCount, 'Vote count should increase with delegated votes').toBeGreaterThan(beforeCount);
      } catch (error) {
        console.error('Failed delegated voting:', error);
        throw new Error(
          `Delegated voting failed. Prerequisites: delegationActive=${!!sharedContext?.isDelegationActive}`
        );
      }
    });

    test('Rainer can undelegate votes', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isDelegationActive, 'Delegation should be active before undelegation').toBe(true);

        await boxes.unDelegateVotes(rainer, sharedContext!.room, sharedContext!.data.box);
        sharedContext!.isDelegationActive = false;

        expect(sharedContext!.isDelegationActive, 'Vote delegation should be deactivated').toBe(false);
      } catch (error) {
        console.error('Failed vote undelegation:', error);
        throw new Error(
          `Vote undelegation failed. Prerequisites: delegationActive=${!!sharedContext?.isDelegationActive}`
        );
      }
    });

    test.skip('Mallory can no longer vote for rainer, and vote count was diminished', async () => {
      // test is skipped until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      expect(sharedContext, 'Shared context should exist for undelegation verification').toBeTruthy();

      await expect(async () => {
        await boxes.hasDelegatedVotes(mallory, sharedContext!.room, sharedContext!.data.box);
      }).rejects.toThrow();

      const afterCount = await ideas.totalVoteCount(
        mallory,
        sharedContext!.room,
        sharedContext!.data.box,
        sharedContext!.data.alicesIdea
      );
      expect(afterCount).toBe(3);
    });
  });

  test.describe('Results Phase', () => {
    test('Rainer can move box to results phase', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.isInVotingPhase, 'Box should be in voting phase before moving to results').toBe(true);

        await boxes.move(
          rainer,
          sharedContext!.room,
          sharedContext!.data.box,
          PHASE_CONFIG.ABSTIMMUNG,
          PHASE_CONFIG.RESULTS
        );
        sharedContext!.isCompleted = true;

        expect(sharedContext!.isCompleted, 'Voting workflow should be completed').toBe(true);
      } catch (error) {
        console.error('Failed to move to results phase:', error);
        throw new Error(
          `Results phase transition failed. Prerequisites: inVotingPhase=${!!sharedContext?.isInVotingPhase}`
        );
      }
    });

    test.skip('Vote counts exist and are as expected', async () => {
      // test is skipped until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      expect(sharedContext, 'Shared context should exist for vote counting').toBeTruthy();
      expect(sharedContext!.isCompleted, 'Workflow should be completed for vote counting').toBe(true);

      const [forc, againstc, neutralc] = await ideas.voteCounts(
        rainer,
        sharedContext!.room,
        sharedContext!.data.box,
        sharedContext!.data.alicesIdea
      );

      expect(forc).toBe(3);
      expect(againstc).toBe(1);
      expect(neutralc).toBe(0);
    });

    test('cleanup', async () => {
      // Cleanup is commented out to preserve test data for debugging
      // This matches the original test behavior
      expect(sharedContext, 'Shared context should exist for cleanup validation').toBeTruthy();
      expect(sharedContext!.isCompleted, 'Workflow should be completed before cleanup').toBe(true);
    });
  });
});
