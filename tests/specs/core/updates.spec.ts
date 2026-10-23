import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';

/**
 * Updates Tests (v2 /updates)
 * Comments on the user's Ideas since the user last opened /updates. The
 * backend only counts comments after that first visit, so the test opens
 * the page once before anyone comments.
 */
test('Updates list new comments on own Ideas', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');

  const idea = entities.createIdea('updates');
  const comment = 'Comment for the updates feed ' + shared.gensym();

  const UpdateItems = userPage.getByTestId('update-item');
  const goToUpdates = () => userPage.goto(`${shared.getHost()}/updates`, { waitUntil: 'domcontentloaded' });

  await test.step('User adds an Idea and sees no updates yet', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);

    await goToUpdates();
    await expect(userPage.getByTestId('updates-empty-state')).toBeVisible();
  });

  await test.step('Student comments on the Idea', async () => {
    await navigation.goToWildIdea(studentPage, seededRoom.name, idea.name);
    await ideas.comment(studentPage, comment);
  });

  await test.step('The dashboard flags the update', async () => {
    await navigation.goToHome(userPage);
    await expect(navigation.dashboardActivityLink(userPage, '/updates')).toHaveAccessibleName(/\b1\b/);
  });

  await test.step('Updates lists the Idea with its comment', async () => {
    await goToUpdates();

    await expect(UpdateItems).toHaveCount(1);
    await expect(UpdateItems.getByRole('heading', { name: idea.name })).toBeVisible();
    await expect(userPage.getByTestId(TEST_IDS.SCOPE_TITLE)).toContainText('1');
  });

  await test.step('The card opens the Idea', async () => {
    await UpdateItems.getByRole('link').click();

    await userPage.waitForURL((url) => url.pathname.includes('/idea/'));
    await expect(userPage.getByTestId('comment-bubble').filter({ hasText: comment })).toBeVisible();
  });
});
