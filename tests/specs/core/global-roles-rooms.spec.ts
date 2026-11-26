import { DbBackchannel } from '../../fixtures/db-backchannel';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as navigation from '../../interactions/navigation';
import { TEST_IDS } from '../../../src/test-ids';

const STANDARD_ROOM_ONLY_MEMBERS = [
  { username: 'supermod', label: 'Super moderator' },
  { username: 'supermod_v', label: 'Super moderator with voting rights' },
  { username: 'principal', label: 'Auditor' },
  { username: 'principal_v', label: 'Auditor with voting rights' },
];

const MEMBERLESS_ROOM = 'e2e.class_2B';

/**
 * School-wide Roles - Room Visibility
 * Super moderators and auditors see every room without being a member of it.
 * Fixtures from sql/140-global-roles.sql: one user per school-wide role, each only a member
 * of the standard room, and a room without members.
 */
test.describe('School-wide Roles - Room Visibility', () => {
  test.beforeEach(async ({ dbInstanceCode, baselineLoaded }) => {
    const dbBackchannel = await DbBackchannel.getByInstanceCode(dbInstanceCode);
    await dbBackchannel.seedGlobalRoles();
  });

  for (const { username, label } of STANDARD_ROOM_ONLY_MEMBERS) {
    test(`${label} sees rooms they are not a member of`, async ({ seededRoom, newPageFor }) => {
      const page = await newPageFor(username);

      await test.step('All rooms are listed on the home page', async () => {
        await navigation.goToHome(page);
        const roomCards = page.getByTestId(TEST_IDS.ROOM_CARD);
        await expect(roomCards.filter({ hasText: seededRoom.name })).toBeVisible();
        await expect(roomCards.filter({ hasText: MEMBERLESS_ROOM })).toBeVisible();
      });

      await test.step('A room without membership can be entered', async () => {
        await navigation.goToRoom(page, MEMBERLESS_ROOM);
        await expect(page.getByText(MEMBERLESS_ROOM).first()).toBeVisible();
        await expect(page.getByTestId('page-not-found-view')).not.toBeVisible();
      });
    });

    test(`${label} can open Rooms Settings`, async ({ seededRoom, newPageFor }) => {
      const page = await newPageFor(username);

      await navigation.goToRoomsSettings(page, true);

      await expect(page.getByTestId('page-not-found-view')).not.toBeVisible();
      await expect(page.getByText(seededRoom.name).first()).toBeVisible();
      await expect(page.getByText(MEMBERLESS_ROOM).first()).toBeVisible();
    });
  }

  test('User only sees the rooms they are a member of', async ({ seededRoom, newPageFor }) => {
    const page = await newPageFor('user');

    await navigation.goToHome(page);

    const roomCards = page.getByTestId(TEST_IDS.ROOM_CARD);
    await expect(roomCards.filter({ hasText: seededRoom.name })).toBeVisible();
    await expect(roomCards.filter({ hasText: MEMBERLESS_ROOM })).toHaveCount(0);
  });
});
