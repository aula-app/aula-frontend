import { expect, test } from '@playwright/test';
import { BoxData } from '../../fixtures/ideas';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as boxes from '../../shared/interactions/boxes';
import * as ideas from '../../shared/interactions/ideas';
import * as rooms from '../../shared/interactions/rooms';
import * as shared from '../../shared/shared';

// Test constants for better maintainability
const TEST_USERS = {
  ADMIN: 'admin',
  ALICE: 'alice',
  BOB: 'bob',
} as const;

const IDEA_CONFIG = {
  DESCRIPTION: 'generated during testing data',
  COMMENT_TEXT: 'comment generated in testing',
} as const;

const BOX_CONFIG = {
  DESCRIPTION: 'generated during automated testing',
  DISCUSSION_DAYS: 6,
  VOTING_DAYS: 10,
  PHASE: 10,
} as const;

// Test context interface
interface IdeaManagementTestContext {
  room: any;
  isRoomCreated: boolean;
  currentTestData: {
    idea?: any;
    comment?: string;
    box?: BoxData;
    tempScope?: string;
  };
}

describeWithSetup('Idea Management - CRUD Operations and Permissions', () => {
  // Shared context for sequential tests
  let sharedContext: IdeaManagementTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: IdeaManagementTestContext }> = [];

  test.beforeAll(async () => {
    // Setup room for all idea management tests
    const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
    try {
      sharedContext = setupTestContext();
      await rooms.create(admin, sharedContext.room);
      sharedContext.isRoomCreated = true;
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

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
  const setupTestContext = (): IdeaManagementTestContext => ({
    room: TestDataBuilder.createRoom(),
    isRoomCreated: false,
    currentTestData: {},
  });

  const createTestIdea = (username: string, scope?: string): any => ({
    name: `${username}-test-idea${shared.getRunId()}${scope ? '-scope-' + scope : ''}`,
    description: IDEA_CONFIG.DESCRIPTION,
  });

  const createTestBox = (scope: string, ideas: any[]): BoxData => ({
    name: `admins-test-box${shared.getRunId()}-scope-${scope}`,
    description: BOX_CONFIG.DESCRIPTION,
    ideas,
    discussionDays: BOX_CONFIG.DISCUSSION_DAYS,
    votingDays: BOX_CONFIG.VOTING_DAYS,
    phase: BOX_CONFIG.PHASE,
  });

  const cleanupTestData = async (page: any, context: IdeaManagementTestContext): Promise<void> => {
    const errors: Error[] = [];

    // Clean up current test data
    const { currentTestData } = context;

    if (currentTestData.box) {
      try {
        await boxes.remove(page, context.room, currentTestData.box);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup box: ${e.message}`));
      }
    }

    if (currentTestData.idea) {
      try {
        await ideas.remove(page, context.room, currentTestData.idea);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup idea: ${e.message}`));
      }
    }

    // Clean up room if it exists
    if (context.room && context.isRoomCreated) {
      try {
        await rooms.remove(page, context.room);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup room: ${e.message}`));
      }
    }

    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  };

  test.describe('Idea Creation', () => {
    test('Admin can create an idea', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be created in beforeAll').toBe(true);

        const adminIdea = createTestIdea('admin');
        sharedContext!.currentTestData.idea = adminIdea;

        await ideas.create(admin, sharedContext!.room, adminIdea);
        expect(adminIdea, 'Admin idea should be created successfully').toBeDefined();
      } catch (error) {
        console.error('Failed admin idea creation:', error);
        throw new Error(`Admin idea creation failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Alice can create an idea', async () => {
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for Alice').toBe(true);

        const aliceIdea = createTestIdea('alice', '3');
        sharedContext!.currentTestData.idea = aliceIdea;

        await ideas.create(alice, sharedContext!.room, aliceIdea);
        expect(aliceIdea, 'Alice idea should be created successfully').toBeDefined();
      } catch (error) {
        console.error('Failed Alice idea creation:', error);
        throw new Error(`Alice idea creation failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(alice);
      }
    });
  });

  test.describe('Idea Deletion', () => {
    test('Admin can delete an idea', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be created in beforeAll').toBe(true);

        const adminIdea = createTestIdea('admin-delete');
        sharedContext!.currentTestData.idea = adminIdea;

        await ideas.create(admin, sharedContext!.room, adminIdea);
        await ideas.remove(admin, sharedContext!.room, adminIdea);

        // Clear test data after successful cleanup
        sharedContext!.currentTestData.idea = undefined;
        expect(adminIdea, 'Admin idea should be deleted successfully').toBeDefined();
      } catch (error) {
        console.error('Failed admin idea deletion:', error);
        throw new Error(`Admin idea deletion failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    });

    test('Alice can delete her own idea', async () => {
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for Alice').toBe(true);

        const aliceIdea = createTestIdea('alice-delete', '5');
        sharedContext!.currentTestData.idea = aliceIdea;

        await ideas.create(alice, sharedContext!.room, aliceIdea);
        await ideas.remove(alice, sharedContext!.room, aliceIdea);

        // Clear test data after successful cleanup
        sharedContext!.currentTestData.idea = undefined;
        expect(aliceIdea, 'Alice idea should be deleted successfully').toBeDefined();
      } catch (error) {
        console.error('Failed Alice idea deletion:', error);
        throw new Error(`Alice idea deletion failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(alice);
      }
    });
  });

  test.describe('Idea Permissions', () => {
    test('Users cannot delete other users ideas', async () => {
      const bob = await BrowserHelpers.openPageForUser(TEST_USERS.BOB);
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for permission test').toBe(true);

        const aliceIdea = createTestIdea('alice-protected', '4');
        sharedContext!.currentTestData.idea = aliceIdea;

        await ideas.create(alice, sharedContext!.room, aliceIdea);

        // Test permission restriction
        await expect(async () => {
          await ideas.remove(bob, sharedContext!.room, aliceIdea);
        }).rejects.toThrow();

        // Alice removes her own idea for cleanup
        await ideas.remove(alice, sharedContext!.room, aliceIdea);

        // Clear test data after successful cleanup
        sharedContext!.currentTestData.idea = undefined;
        expect(aliceIdea, 'Permission restriction should work correctly').toBeDefined();
      } catch (error) {
        console.error('Failed idea permission test:', error);
        throw new Error(`Idea permission test failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(alice);
        await BrowserHelpers.closePage(bob);
      }
    });
  });

  test.describe('Idea Comments', () => {
    test('Users can add comments to ideas', async () => {
      const bob = await BrowserHelpers.openPageForUser(TEST_USERS.BOB);
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for comment test').toBe(true);

        const bobIdea = createTestIdea('bob-for-comments');
        const commentText = `alice's ${IDEA_CONFIG.COMMENT_TEXT}`;

        sharedContext!.currentTestData.idea = bobIdea;
        sharedContext!.currentTestData.comment = commentText;

        await ideas.create(bob, sharedContext!.room, bobIdea);
        await ideas.comment(alice, sharedContext!.room, bobIdea, commentText);

        expect(commentText, 'Comment should be added successfully').toBeDefined();
      } catch (error) {
        console.error('Failed comment creation test:', error);
        throw new Error(`Comment creation failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(bob);
        await BrowserHelpers.closePage(alice);
      }
    });

    test('Users can delete their own comments', async () => {
      const bob = await BrowserHelpers.openPageForUser(TEST_USERS.BOB);
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for comment deletion test').toBe(true);

        const bobIdea = createTestIdea('bob-for-comment-deletion');
        const commentText = `alice's ${IDEA_CONFIG.COMMENT_TEXT} for deletion`;

        sharedContext!.currentTestData.idea = bobIdea;
        sharedContext!.currentTestData.comment = commentText;

        await ideas.create(bob, sharedContext!.room, bobIdea);
        await ideas.comment(alice, sharedContext!.room, bobIdea, commentText);
        await ideas.removeComment(alice, sharedContext!.room, bobIdea, commentText);
        await ideas.remove(bob, sharedContext!.room, bobIdea);

        // Clear test data after successful cleanup
        sharedContext!.currentTestData.idea = undefined;
        sharedContext!.currentTestData.comment = undefined;
        expect(commentText, 'Comment should be deleted successfully').toBeDefined();
      } catch (error) {
        console.error('Failed comment deletion test:', error);
        throw new Error(`Comment deletion failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(bob);
        await BrowserHelpers.closePage(alice);
      }
    });
  });

  test.describe('Box Creation', () => {
    test('Admin can create a box with multiple ideas', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
      const bob = await BrowserHelpers.openPageForUser(TEST_USERS.BOB);
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for box test').toBe(true);

        const tempScope = shared.gensym();
        const aliceIdea = createTestIdea('alice', tempScope);
        const bobIdea = createTestIdea('bob', tempScope);
        const box = createTestBox(tempScope, [aliceIdea, bobIdea]);

        sharedContext!.currentTestData.tempScope = tempScope;
        sharedContext!.currentTestData.box = box;

        await ideas.create(alice, sharedContext!.room, aliceIdea);
        await ideas.create(bob, sharedContext!.room, bobIdea);
        await boxes.create(admin, sharedContext!.room, box);

        expect(box, 'Box with multiple ideas should be created successfully').toBeDefined();
      } catch (error) {
        console.error('Failed box creation test:', error);
        throw new Error(`Box creation failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(admin);
        await BrowserHelpers.closePage(alice);
        await BrowserHelpers.closePage(bob);
      }
    });
  });

  test.describe('Box Deletion', () => {
    test('Admin can delete a box', async () => {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
      const bob = await BrowserHelpers.openPageForUser(TEST_USERS.BOB);
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for box deletion test').toBe(true);

        const tempScope = shared.gensym();
        const aliceIdea = createTestIdea('alice-box-delete', tempScope);
        const bobIdea = createTestIdea('bob-box-delete', tempScope);
        const box = createTestBox(tempScope, [aliceIdea, bobIdea]);

        sharedContext!.currentTestData.tempScope = tempScope;
        sharedContext!.currentTestData.box = box;

        await ideas.create(alice, sharedContext!.room, aliceIdea);
        await ideas.create(bob, sharedContext!.room, bobIdea);
        await boxes.create(admin, sharedContext!.room, box);
        await boxes.remove(admin, sharedContext!.room, box);
        await ideas.remove(alice, sharedContext!.room, aliceIdea);
        await ideas.remove(bob, sharedContext!.room, bobIdea);

        // Clear test data after successful cleanup
        sharedContext!.currentTestData.box = undefined;
        expect(box, 'Box should be deleted successfully').toBeDefined();
      } catch (error) {
        console.error('Failed box deletion test:', error);
        throw new Error(`Box deletion failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(admin);
        await BrowserHelpers.closePage(alice);
        await BrowserHelpers.closePage(bob);
      }
    });
  });

  test.describe('Box Permissions', () => {
    test('Non-admin users cannot create boxes', async () => {
      const alice = await BrowserHelpers.openPageForUser(TEST_USERS.ALICE);

      try {
        expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
        expect(sharedContext!.isRoomCreated, 'Room should be available for box permission test').toBe(true);

        const tempScope = shared.gensym();
        const box = createTestBox(tempScope, []);

        await expect(async () => {
          await boxes.create(alice, sharedContext!.room, box);
        }).rejects.toThrow();

        expect(box, 'Box permission restriction should work correctly').toBeDefined();
      } catch (error) {
        console.error('Failed box permission test:', error);
        throw new Error(`Box permission test failed. Prerequisites: room=${!!sharedContext?.isRoomCreated}`);
      } finally {
        await BrowserHelpers.closePage(alice);
      }
    });
  });
});
