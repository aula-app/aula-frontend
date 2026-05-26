import { test, expect } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as rooms from '../../interactions/rooms';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

/**
 * Room Creation and accessing Ideas
 *
 * Tests that users who are members of a room can see ideas when they enter the room
 * Uses pure Playwright fixtures for setup/teardown
 */
test('Room Creation and accessing Ideas', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');

  const adminIdea = entities.createIdea('admin-visible');
  const room = entities.createRoom('room-tests.new-room', [{ username: seededUser.username }]);

  await test.step('Admin can create a Room and add an Idea', async () => {
    await rooms.create(adminPage, room);
    await navigation.goToRoom(adminPage, room.name);
    await ideas.create(adminPage, adminIdea);
  });

  await test.step('User member can access individual idea details', async () => {
    await navigation.goToWildIdea(userPage, room.name, adminIdea.name);

    // Use more specific selectors to avoid multiple matches
    await expect(userPage.getByRole('heading', { name: adminIdea.name })).toBeVisible();
    await expect(userPage.getByText(adminIdea.description)).toBeVisible();
  });

  // @TODO: Un-Skip when https://github.com/aula-app/aula-frontend/issues/1169 is fixed
  await test.step.skip('Student is not part of the Room, can\'t see the Idea', async () => {
    await navigation.goToRoom(studentPage, room.name);
    await expect(userPage.getByTestId('page-not-found-view')).toBeVisible();
  });
});
