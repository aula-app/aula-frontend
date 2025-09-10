import { test, expect } from '@playwright/test';
import { describeWithSetup } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { ReportingTestHelpers, ReportingTestContext } from '../../shared/helpers/reporting';
import * as shared from '../../shared/shared';

describeWithSetup('Reporting flow', () => {
  // Track cleanup contexts for emergency cleanup
  const cleanupQueue: Array<{ page: any; context: ReportingTestContext }> = [];

  test.afterEach(async () => {
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

  test('Complete reporting workflow: room creation, idea reporting, comment reporting, and bug reporting', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');
    const alice = await BrowserHelpers.openPageForUser('alice');
    const bob = await BrowserHelpers.openPageForUser('bob');

    try {
      await ReportingTestHelpers.executeWithCleanup(
        admin,
        async (context) => {
          const { room, data } = context;

          // Step 1: Admin creates a room with users
          await ReportingTestHelpers.createRoomWithUsers(admin, room);

          // Step 2: Alice creates an idea
          await ReportingTestHelpers.createIdeaForTesting(alice, room, data);

          // Step 3: Bob reports Alice's idea
          expect(data.alicesIdea).toBeDefined();
          await ReportingTestHelpers.reportIdea(bob, room, data.alicesIdea, 'misinformation');
          await ReportingTestHelpers.checkIdeaReport(admin, data.alicesIdea);

          // Step 4: Bob comments on Alice's idea
          data.bobsComment = 'You posted misinformation' + shared.gensym();
          await ReportingTestHelpers.addComment(bob, room, data.alicesIdea, data.bobsComment);

          // Step 5: Alice reports Bob's comment
          await ReportingTestHelpers.reportComment(alice, room, data.alicesIdea, data.bobsComment, 'misinformation');
          await ReportingTestHelpers.checkCommentReport(admin, data.bobsComment);

          // Step 6: Alice reports a bug
          data.bugreport = 'This does not work' + shared.gensym();
          await ReportingTestHelpers.reportBug(alice, data.bugreport);
          await ReportingTestHelpers.checkBugReport(admin, data.bugreport);
        },
        cleanupQueue
      );
    } finally {
      await BrowserHelpers.closePage(admin);
      await BrowserHelpers.closePage(alice);
      await BrowserHelpers.closePage(bob);
    }
  });
});
