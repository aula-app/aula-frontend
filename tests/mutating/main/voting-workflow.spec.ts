import { expect, test } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { VotingWorkflowTestHelpers, VotingWorkflowTestContext } from '../../shared/helpers/voting-workflow';
import { alice, bob, mallory, rainer } from '../../shared/interactions/browsers';

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

describeWithSetup('Voting Workflow - Complete Process from Creation to Results', () => {
  // Shared context for sequential tests
  let sharedContext: VotingWorkflowTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: VotingWorkflowTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext) {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
      try {
        await VotingWorkflowTestHelpers.cleanupTestData(admin, sharedContext);
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
        await VotingWorkflowTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test.describe('Setup and Approval Phase', () => {
    test('Create ideas and box for voting workflow', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        // Initialize shared context for the test suite
        sharedContext = await VotingWorkflowTestHelpers.setupVotingWorkflowTest();
        expect(sharedContext, 'Test context should be initialized successfully').toBeDefined();

        // Create room and ideas
        await VotingWorkflowTestHelpers.createRoomAndIdeas(admin, sharedContext, alice, bob);
        await VotingWorkflowTestHelpers.createVotingBox(admin, sharedContext);

        expect(sharedContext.data.alicesIdea, "Alice's idea should be created successfully").toBeDefined();
        expect(sharedContext.data.bobsIdea, "Bob's idea should be created successfully").toBeDefined();
        expect(sharedContext.data.box, 'Box should be created successfully').toBeDefined();
        expect(sharedContext.data.isRoomCreated, 'Room should be created successfully').toBe(true);
        expect(sharedContext.data.isBoxCreated, 'Box should be created successfully').toBe(true);
      } catch (error) {
        console.error('Failed to create voting workflow setup:', error);
        throw new Error(
          `Voting workflow setup failed. Prerequisites: context=${!!sharedContext}, roomCreated=${!!sharedContext?.data.isRoomCreated}, boxCreated=${!!sharedContext?.data.isBoxCreated}`
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Move box to prüfung phase', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        expect(sharedContext, 'Shared context should exist from previous test').toBeTruthy();
        expect(sharedContext!.data.isBoxCreated, 'Box should be created in previous test').toBe(true);

        await VotingWorkflowTestHelpers.moveBoxToPhase(
          admin,
          sharedContext!,
          PHASE_CONFIG.DISCUSSION,
          PHASE_CONFIG.PRÜFUNG
        );

        expect(sharedContext!.data.box, 'Box should be moved to prüfung phase successfully').toBeDefined();
      } catch (error) {
        console.error('Failed to move box to prüfung phase:', error);
        throw new Error(
          `Phase transition failed. Prerequisites: boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Rainer can approve ideas in prüfung phase', async () => {
      test.setTimeout(VOTING_CONFIG.TIMEOUT);

      try {
        expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
        expect(sharedContext!.data.isBoxCreated, 'Box should be in prüfung phase').toBe(true);
        expect(sharedContext!.data.isRoomCreated, 'Room should exist for approval').toBe(true);

        await VotingWorkflowTestHelpers.approveIdeas(rainer, sharedContext!);

        expect(sharedContext!.data.alicesIdea, "Alice's idea should be approved").toBeDefined();
        expect(sharedContext!.data.bobsIdea, "Bob's idea should be approved").toBeDefined();
      } catch (error) {
        console.error('Failed to approve ideas:', error);
        throw new Error(
          `Idea approval failed. Prerequisites: boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      }
    });

    test('Rainer can move the box to abstimmung phase', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.data.isBoxCreated, 'Box should be ready for abstimmung').toBe(true);
        expect(sharedContext!.data.isRoomCreated, 'Room should exist for phase transition').toBe(true);

        await VotingWorkflowTestHelpers.moveBoxToPhase(
          rainer,
          sharedContext!,
          PHASE_CONFIG.PRÜFUNG,
          PHASE_CONFIG.ABSTIMMUNG
        );

        expect(sharedContext!.data.isInVotingPhase, 'Box should be in abstimmung phase').toBe(true);
      } catch (error) {
        console.error('Failed to move box to abstimmung:', error);
        throw new Error(
          `Abstimmung phase transition failed. Prerequisites: boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      }
    });
  });

  test.describe('Voting Phase', () => {
    test('Users can vote on ideas', async () => {
      try {
        expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
        expect(sharedContext!.data.isInVotingPhase, 'Box should be in voting phase').toBe(true);
        expect(sharedContext!.data.isBoxCreated, 'Box should exist for voting').toBe(true);
        expect(sharedContext!.data.isRoomCreated, 'Room should exist for voting').toBe(true);

        await VotingWorkflowTestHelpers.castVotes(alice, bob, rainer, sharedContext!);

        expect(sharedContext!.data.alicesIdea, "Alice and Bob should be able to vote on Alice's idea").toBeDefined();
        expect(sharedContext!.data.bobsIdea, "Alice and Bob should be able to vote on Bob's idea").toBeDefined();
      } catch (error) {
        console.error('Failed user voting:', error);
        throw new Error(
          `User voting failed. Prerequisites: inVotingPhase=${!!sharedContext?.data.isInVotingPhase}, boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      }
    });
  });

  test.describe('Vote Delegation', () => {
    test('Rainer can delegate votes to Mallory', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.data.isInVotingPhase, 'Box should be in voting phase for delegation').toBe(true);
        expect(sharedContext!.data.isBoxCreated, 'Box should exist for delegation').toBe(true);
        expect(sharedContext!.data.isRoomCreated, 'Room should exist for delegation').toBe(true);

        await VotingWorkflowTestHelpers.delegateVotes(rainer, sharedContext!);

        expect(sharedContext!.data.isDelegationActive, 'Vote delegation should be active').toBe(true);
      } catch (error) {
        console.error('Failed vote delegation:', error);
        throw new Error(
          `Vote delegation failed. Prerequisites: inVotingPhase=${!!sharedContext?.data.isInVotingPhase}, boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      }
    });

    test('Mallory receives delegated votes and can vote with them', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.data.isDelegationActive, 'Vote delegation should be active').toBe(true);
        expect(sharedContext!.data.isInVotingPhase, 'Box should be in voting phase').toBe(true);

        await VotingWorkflowTestHelpers.checkDelegatedVotes(mallory, sharedContext!);

        const { before: beforeCount, after: afterCount } = await VotingWorkflowTestHelpers.voteWithDelegation(
          mallory,
          sharedContext!
        );
        expect(beforeCount).toBe(3);
        expect(afterCount).toBe(beforeCount + 1);

        expect(afterCount, 'Vote count should increase with delegated votes').toBeGreaterThan(beforeCount);
      } catch (error) {
        console.error('Failed delegated voting:', error);
        throw new Error(
          `Delegated voting failed. Prerequisites: delegationActive=${!!sharedContext?.data.isDelegationActive}, inVotingPhase=${!!sharedContext?.data.isInVotingPhase}, boxCreated=${!!sharedContext?.data.isBoxCreated}`
        );
      }
    });

    test('Rainer can undelegate votes', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.data.isDelegationActive, 'Delegation should be active before undelegation').toBe(true);
        expect(sharedContext!.data.isInVotingPhase, 'Box should be in voting phase').toBe(true);

        await VotingWorkflowTestHelpers.undelegateVotes(rainer, sharedContext!);

        expect(sharedContext!.data.isDelegationActive, 'Vote delegation should be deactivated').toBe(false);
      } catch (error) {
        console.error('Failed vote undelegation:', error);
        throw new Error(
          `Vote undelegation failed. Prerequisites: delegationActive=${!!sharedContext?.data.isDelegationActive}, inVotingPhase=${!!sharedContext?.data.isInVotingPhase}, boxCreated=${!!sharedContext?.data.isBoxCreated}`
        );
      }
    });

    test.skip('Mallory can no longer vote for rainer, and vote count was diminished', async () => {
      // test is skipped until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      expect(sharedContext, 'Shared context should exist for undelegation verification').toBeTruthy();
      expect(sharedContext!.data.isDelegationActive, 'Delegation should be deactivated').toBe(false);

      await expect(async () => {
        await VotingWorkflowTestHelpers.checkDelegatedVotes(mallory, sharedContext!);
      }).rejects.toThrow();

      const { before: afterCount } = await VotingWorkflowTestHelpers.voteWithDelegation(mallory, sharedContext!);
      expect(afterCount).toBe(3);
    });
  });

  test.describe('Results Phase', () => {
    test('Rainer can move box to results phase', async () => {
      try {
        expect(sharedContext, 'Shared context should exist').toBeTruthy();
        expect(sharedContext!.data.isInVotingPhase, 'Box should be in voting phase before moving to results').toBe(
          true
        );
        expect(sharedContext!.data.isBoxCreated, 'Box should exist for phase transition').toBe(true);
        expect(sharedContext!.data.isRoomCreated, 'Room should exist for phase transition').toBe(true);

        await VotingWorkflowTestHelpers.moveBoxToPhase(
          rainer,
          sharedContext!,
          PHASE_CONFIG.ABSTIMMUNG,
          PHASE_CONFIG.RESULTS
        );

        expect(sharedContext!.data.isCompleted, 'Voting workflow should be completed').toBe(true);
      } catch (error) {
        console.error('Failed to move to results phase:', error);
        throw new Error(
          `Results phase transition failed. Prerequisites: inVotingPhase=${!!sharedContext?.data.isInVotingPhase}, boxCreated=${!!sharedContext?.data.isBoxCreated}, roomCreated=${!!sharedContext?.data.isRoomCreated}`
        );
      }
    });

    test.skip('Vote counts exist and are as expected', async () => {
      // test is skipped until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      expect(sharedContext, 'Shared context should exist for vote counting').toBeTruthy();
      expect(sharedContext!.data.isCompleted, 'Workflow should be completed for vote counting').toBe(true);
      expect(sharedContext!.data.isBoxCreated, 'Box should exist for vote counting').toBe(true);
      expect(sharedContext!.data.isRoomCreated, 'Room should exist for vote counting').toBe(true);

      const [forc, againstc, neutralc] = await VotingWorkflowTestHelpers.getVoteCounts(rainer, sharedContext!);

      expect(forc).toBe(3);
      expect(againstc).toBe(1);
      expect(neutralc).toBe(0);
    });

    test('cleanup', async () => {
      // Cleanup is commented out to preserve test data for debugging
      // This matches the original test behavior
      expect(sharedContext, 'Shared context should exist for cleanup validation').toBeTruthy();
      expect(sharedContext!.data.isCompleted, 'Workflow should be completed before cleanup').toBe(true);
      expect(sharedContext!.data.isBoxCreated, 'Box should exist for cleanup validation').toBe(true);
      expect(sharedContext!.data.isRoomCreated, 'Room should exist for cleanup validation').toBe(true);
    });
  });
});
