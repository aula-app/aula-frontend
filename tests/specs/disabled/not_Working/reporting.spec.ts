import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../lifecycle/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { ReportingTestHelpers, ReportingTestContext } from '../../shared/helpers/reporting';
import * as shared from '../../support/utils';

// Test constants for better maintainability
const REPORT_TYPES = {
  MISINFORMATION: 'misinformation',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
} as const;

const TEST_MESSAGES = {
  COMMENT_TEXT: 'Test comment for reporting',
  BUG_REPORT: 'Test bug report',
} as const;

describeWithSetup('Reporting flow', () => {
  // Shared context for sequential tests
  let sharedContext: ReportingTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: ReportingTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext) {
      const admin = await BrowserHelpers.openPageForUser('admin');
      try {
        await ReportingTestHelpers.cleanupTestData(admin, sharedContext);
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
        await ReportingTestHelpers.cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  test('Admin can create a room with users', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      // Initialize shared context for the test suite
      sharedContext = await ReportingTestHelpers.setupReportingTest();

      const { room } = sharedContext;
      await ReportingTestHelpers.createRoomWithUsers(admin, room);
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Alice creates an idea', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    try {
      expect(sharedContext, 'Shared context should be initialized from previous test').toBeTruthy();
      const { room, data } = sharedContext!;
      expect(room, 'Room should be created from previous test').toBeDefined();

      await ReportingTestHelpers.createIdeaForTesting(alice, room, data);
      expect(data.alicesIdea, "Alice's idea should be created successfully").toBeDefined();
    } catch (error) {
      console.error('Failed to create idea for Alice:', error);
      throw new Error(
        `Alice idea creation failed. Context state: room=${!!sharedContext?.room}, data=${!!sharedContext?.data}`
      );
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test("Bob reports Alice's idea", async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea, "Alice's idea should exist before reporting").toBeDefined();
      expect(room, 'Room should exist for reporting').toBeDefined();

      await ReportingTestHelpers.reportIdea(bob, room, data.alicesIdea, REPORT_TYPES.MISINFORMATION);
      await ReportingTestHelpers.checkIdeaReport(admin, data.alicesIdea);

      // Validate reporting succeeded
      data.isIdeaReported = true;
    } catch (error) {
      console.error("Failed to report Alice's idea:", error);
      throw new Error(
        `Idea reporting failed. Prerequisites: idea=${!!sharedContext?.data.alicesIdea}, room=${!!sharedContext?.room}`
      );
    } finally {
      await BrowserHelpers.closePage(bob);
      await BrowserHelpers.closePage(admin);
    }
  });

  test("Bob comments on Alice's idea", async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');

    try {
      expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea, "Alice's idea should exist before commenting").toBeDefined();
      expect(room, 'Room should exist for commenting').toBeDefined();

      data.bobsComment = TEST_MESSAGES.COMMENT_TEXT + ' ' + shared.gensym();
      await ReportingTestHelpers.addComment(bob, room, data.alicesIdea, data.bobsComment);

      expect(data.bobsComment, "Bob's comment should be created successfully").toBeDefined();
      data.isCommentCreated = true;
    } catch (error) {
      console.error("Failed to add Bob's comment:", error);
      throw new Error(
        `Comment creation failed. Prerequisites: idea=${!!sharedContext?.data.alicesIdea}, room=${!!sharedContext?.room}`
      );
    } finally {
      await BrowserHelpers.closePage(bob);
    }
  });

  test("Alice reports Bob's comment", async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea, "Alice's idea should exist").toBeDefined();
      expect(data.bobsComment, "Bob's comment should exist before reporting").toBeDefined();
      expect(data.isCommentCreated, 'Comment should be successfully created in previous test').toBe(true);

      await ReportingTestHelpers.reportComment(
        alice,
        room,
        data.alicesIdea,
        data.bobsComment,
        REPORT_TYPES.MISINFORMATION
      );
      await ReportingTestHelpers.checkCommentReport(admin, data.bobsComment);

      // Validate comment reporting succeeded
      data.isCommentReported = true;
    } catch (error) {
      console.error("Failed to report Bob's comment:", error);
      throw new Error(
        `Comment reporting failed. Prerequisites: comment=${!!sharedContext?.data.bobsComment}, commentCreated=${!!sharedContext?.data.isCommentCreated}`
      );
    } finally {
      await BrowserHelpers.closePage(alice);
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Alice reports a bug', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext, 'Shared context should be initialized').toBeTruthy();
      const { data } = sharedContext!;

      data.bugreport = TEST_MESSAGES.BUG_REPORT + ' ' + shared.gensym();
      await ReportingTestHelpers.reportBug(alice, data.bugreport);
      await ReportingTestHelpers.checkBugReport(admin, data.bugreport);

      expect(data.bugreport, 'Bug report should be created successfully').toBeDefined();
      data.isBugReported = true;
    } catch (error) {
      console.error('Failed to report bug:', error);
      throw new Error('Bug reporting failed. This test is independent and should not require previous test data.');
    } finally {
      await BrowserHelpers.closePage(alice);
      await BrowserHelpers.closePage(admin);
    }
  });
});
