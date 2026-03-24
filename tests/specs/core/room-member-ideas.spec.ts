import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

/**
 * Room Member Ideas Visibility Tests
 * Tests that users who are members of a room can see ideas when they enter the room
 * Uses pure Playwright fixtures for setup/teardown
 */
test.describe('Room Member - Ideas Visibility', () => {
  let roomContext: roomsFixture.RoomContext;

  const adminIdea = entities.createIdea('admin-visible');
  const userIdea = entities.createIdea('user-visible');

  test('Setup: Admin creates room and adds ideas', async ({ adminPage, userConfig, studentConfig }) => {
    await test.step('Setup room context with member users', async () => {
      roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'member-ideas-test');
    });

    await test.step('Navigate to room', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
    });

    await test.step('Admin creates first idea', async () => {
      await ideas.create(adminPage, adminIdea);
    });

    await test.step('Admin creates second idea', async () => {
      await ideas.create(adminPage, userIdea);
    });
  });

  test('Member user can see ideas when entering room', async ({ userPage }) => {
    await test.step('User navigates to room', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
    });

    await test.step('User can see admin idea', async () => {
      const adminIdeaElement = userPage.getByTestId(`idea-${adminIdea.name}`);
      await expect(adminIdeaElement).toBeVisible({ timeout: 10000 });
    });

    await test.step('User can see second idea', async () => {
      const userIdeaElement = userPage.getByTestId(`idea-${userIdea.name}`);
      await expect(userIdeaElement).toBeVisible({ timeout: 10000 });
    });

    await test.step('Verify room title is displayed', async () => {
      await expect(userPage.getByText(roomContext.room.name)).toBeVisible();
    });
  });

  test('Student member can also see ideas when entering room', async ({ studentPage }) => {
    await test.step('Student navigates to room', async () => {
      await navigation.goToRoom(studentPage, roomContext.room.name);
    });

    await test.step('Student can see admin idea', async () => {
      const adminIdeaElement = studentPage.getByTestId(`idea-${adminIdea.name}`);
      await expect(adminIdeaElement).toBeVisible({ timeout: 10000 });
    });

    await test.step('Student can see second idea', async () => {
      const userIdeaElement = studentPage.getByTestId(`idea-${userIdea.name}`);
      await expect(userIdeaElement).toBeVisible({ timeout: 10000 });
    });
  });

  test('Member can access individual idea details', async ({ userPage }) => {
    await test.step('User navigates to specific idea', async () => {
      await navigation.goToWildIdea(userPage, roomContext.room.name, adminIdea.name);
    });

    await test.step('Verify idea details are visible', async () => {
      // Use more specific selectors to avoid multiple matches
      await expect(userPage.getByRole('heading', { name: adminIdea.name })).toBeVisible();
      await expect(userPage.getByText(adminIdea.description)).toBeVisible();
    });
  });
});