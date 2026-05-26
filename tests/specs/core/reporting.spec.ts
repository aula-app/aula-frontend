import { expect, test } from '../../fixtures/db-backchannel/new-fixture';
import * as settingsInteractions from '../../interactions/settings';
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
test('Content Reports', async ({ seededRoom, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const adminIdeaMisinformation = entities.createIdea('admin-misinformation');
  const userCommentSpam = 'Mallicious test comment from user ' + shared.gensym();

  await test.step('Admin creates an idea', async () => {
    await navigation.goToRoom(adminPage, seededRoom.name);
    await ideas.create(adminPage, adminIdeaMisinformation);
  });

  await test.step('User reports Admin\'s Idea', async () => {
    await reporting.reportIdea(userPage, seededRoom, adminIdeaMisinformation.name, reporting.REPORT_TYPES.MISINFORMATION);
  });

  await test.step('Admin verifies report exists', async () => {
    await reporting.verifyIdeaReported(adminPage, adminIdeaMisinformation.name);
  });

  await test.step("User comments on Admin's idea", async () => {
    await navigation.goToWildIdea(userPage, seededRoom.name, adminIdeaMisinformation.name);
    await ideas.comment(userPage, userCommentSpam);
  });

  await test.step("Admin reports User's comment", async () => {
    await reporting.reportComment(
      adminPage,
      seededRoom,
      adminIdeaMisinformation.name,
      userCommentSpam,
      reporting.REPORT_TYPES.SPAM
    );
    await reporting.verifyCommentReported(adminPage, userCommentSpam);
  });
});

test('Bug Reports', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const bugReport = 'Test bug report ' + shared.gensym();

  await test.step('User submits bug report', async () => {
    await reporting.reportBug(userPage, bugReport);
  });

  await test.step('Admin verifies bug report exists', async () => {
    await reporting.verifyBugReported(adminPage, bugReport);
  });

  await test.step('Admin archives the bug report', async () => {
    await adminPage.getByRole('button', { name: 'archiv', exact: false }).click();
  });

  await test.step('Admin verifies bug report is gone', async () => {
    await navigation.goToBugsSettings(adminPage, true);
    await settingsInteractions.applyFilter(adminPage, { option: 'body', value: bugReport });
    await expect(adminPage.locator('text=' + bugReport).first()).not.toBeVisible();
  });
});
