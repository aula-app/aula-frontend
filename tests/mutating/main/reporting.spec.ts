import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { ReportingTestHelpers, ReportingTestContext } from '../../shared/helpers/reporting';
import * as shared from '../../shared/shared';

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
      expect(sharedContext).toBeTruthy();
      const { room, data } = sharedContext!;
      
      await ReportingTestHelpers.createIdeaForTesting(alice, room, data);
      expect(data.alicesIdea).toBeDefined();
    } finally {
      await BrowserHelpers.closePage(alice);
    }
  });

  test('Bob reports Alice\'s idea', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext).toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea).toBeDefined();
      
      await ReportingTestHelpers.reportIdea(bob, room, data.alicesIdea, 'misinformation');
      await ReportingTestHelpers.checkIdeaReport(admin, data.alicesIdea);
    } finally {
      await BrowserHelpers.closePage(bob);
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Bob comments on Alice\'s idea', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');

    try {
      expect(sharedContext).toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea).toBeDefined();
      
      data.bobsComment = 'You posted misinformation' + shared.gensym();
      await ReportingTestHelpers.addComment(bob, room, data.alicesIdea, data.bobsComment);
      expect(data.bobsComment).toBeDefined();
    } finally {
      await BrowserHelpers.closePage(bob);
    }
  });

  test('Alice reports Bob\'s comment', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext).toBeTruthy();
      const { room, data } = sharedContext!;
      expect(data.alicesIdea).toBeDefined();
      expect(data.bobsComment).toBeDefined();
      
      await ReportingTestHelpers.reportComment(alice, room, data.alicesIdea, data.bobsComment, 'misinformation');
      await ReportingTestHelpers.checkCommentReport(admin, data.bobsComment);
    } finally {
      await BrowserHelpers.closePage(alice);
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Alice reports a bug', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext).toBeTruthy();
      const { data } = sharedContext!;
      
      data.bugreport = 'This does not work' + shared.gensym();
      await ReportingTestHelpers.reportBug(alice, data.bugreport);
      await ReportingTestHelpers.checkBugReport(admin, data.bugreport);
      expect(data.bugreport).toBeDefined();
    } finally {
      await BrowserHelpers.closePage(alice);
      await BrowserHelpers.closePage(admin);
    }
  });
});
