import { expect } from '@playwright/test';
import { test } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as reporting from '../../interactions/reporting';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

/**
 * Reporting Flow Tests
 * Tests content reporting (ideas, comments) and bug reporting
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Create room → Create idea → Report idea → Add comment → Report comment → Report bug
 */
test.describe.serial('Reporting - Content Reports and Bug Reports', () => {
  let roomContext: roomsFixture.RoomContext;

  const adminIdea = entities.createIdea('admin');
  const bobComment = 'Test comment from bob ' + shared.gensym();
  const bugReport = 'Test bug report ' + shared.gensym();

  test('Admin can create a room with users', async ({ adminPage, userConfig, studentConfig }) => {
    await test.step('Setup room context', async () => {
      // Setup shared room context on first test
      if (!roomContext) {
        roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'reporting-tests');
      }
    });

    await test.step('Navigate to room', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
    });

    await test.step('Verify room is accessible', async () => {
      await expect(adminPage.getByText(roomContext.room.name)).toBeVisible();
    });
  });

  test('Admin creates an idea', async ({ adminPage }) => {
    await test.step('Navigate to room', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
    });

    await test.step('Create idea', async () => {
      await ideas.create(adminPage, adminIdea);
    });
  });

  test("User reports Admin's idea", async ({ userPage, adminPage }) => {
    await test.step('User reports the idea', async () => {
      await reporting.reportIdea(userPage, roomContext.room, adminIdea.name, reporting.REPORT_TYPES.MISINFORMATION);
    });

    await test.step('Admin verifies report exists', async () => {
      await reporting.verifyIdeaReported(adminPage, adminIdea.name);
    });
  });

  test("User comments on Admin's idea", async ({ userPage }) => {
    await test.step('Navigate to idea', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
    });

    await test.step('Add comment', async () => {
      await ideas.comment(userPage, bobComment);
    });
  });

  test("Admin reports User's comment", async ({ adminPage }) => {
    await test.step('Admin reports the comment', async () => {
      await reporting.reportComment(
        adminPage,
        roomContext.room,
        adminIdea.name,
        bobComment,
        reporting.REPORT_TYPES.SPAM
      );
    });

    await test.step('Admin verifies comment report exists', async () => {
      await reporting.verifyCommentReported(adminPage, bobComment);
    });
  });

  test('User reports a bug', async ({ userPage, adminPage }) => {
    await test.step('User submits bug report', async () => {
      await reporting.reportBug(userPage, bugReport);
    });

    await test.step('Admin verifies bug report exists', async () => {
      await reporting.verifyBugReported(adminPage, bugReport);
    });
  });
});
