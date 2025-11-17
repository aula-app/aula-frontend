import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

/**
 * Box Management Tests
 * Tests box creation, phase changes, permissions, and idea movement
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * Create box → Move ideas to box → Change box phase → Delete box
 */
test.describe.serial('Box Management - Creation, phase changes and Permissions', () => {
  let roomContext: roomsFixture.RoomContext;
  let box: BoxData;

  const boxIdea = entities.createIdea('box-idea');

  test('Admin can create a box inside a room', async ({ adminPage, userConfig, studentConfig }) => {
    await test.step('Setup room context', async () => {
      // Setup shared room context on first test
      if (!roomContext) {
        roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'box-tests');
        // Create box after room context is set up
        box = entities.createBox('box-in-room', roomContext.room);
      }
    });

    await test.step('Create box via UI', async () => {
      await boxes.create(adminPage, box);
    });
  });

  test('User cannot create a box', async ({ userPage }) => {
    await test.step('Attempt to create box as non-admin', async () => {
      await expect(boxes.create(userPage, entities.createBox('unauthorized-box', roomContext.room))).rejects.toThrow();
    });
  });

  test('User can access the new box', async ({ userPage }) => {
    await test.step('Navigate to box phase', async () => {
      await navigation.goToPhase(userPage, roomContext.room.name, 10);
      await navigation.clickOnPageItem(userPage, box.name);
    });

    await test.step('Verify box is visible', async () => {
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  // test('User can create an Idea in the box', async () => {
  //   await navigation.goToPhase(user, roomContext.room.name, 10);
  //   await navigation.clickOnPageItem(user, box.name);
  //   const boxTitle = user.getByTestId('box-card').getByText(box.name);
  //   await expect(boxTitle).toBeVisible();
  //   await ideas.create(user, boxIdea);
  // });

  test('Admin can move an Idea in the box', async ({ adminPage, userPage }) => {
    await test.step('Create idea in room', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
      await ideas.create(userPage, boxIdea);
    });

    await test.step('Move idea to box', async () => {
      const boxNewPhaseObject = { ...box, ideas: [boxIdea] } as BoxData;

      await navigation.goToPhase(adminPage, roomContext.room.name, 10);
      await navigation.clickOnPageItem(adminPage, box.name);
      const boxCard = adminPage.getByTestId('box-card');
      await expect(boxCard.getByText(box.name)).toBeVisible();
      await boxCard.getByTestId('more-options-button').click();
      await adminPage.waitForTimeout(500);
      await boxCard.getByTestId('edit-button').click();
      await boxes.fill(adminPage, boxNewPhaseObject);
    });

    await test.step('Verify idea is in box', async () => {
      const boxTitle = adminPage.getByText(boxIdea.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Admin can change box phase', async ({ adminPage, userPage }) => {
    await test.step('Change box phase to 20', async () => {
      const boxNewPhaseObject = { ...box, phase: 20 } as BoxData;
      await boxes.edit(adminPage, boxNewPhaseObject);
    });

    await test.step('Verify box is in new phase', async () => {
      await navigation.goToPhase(userPage, roomContext.room.name, 20);
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Admin can delete a box', async ({ adminPage }) => {
    await test.step('Delete box via settings', async () => {
      await boxes.remove(adminPage, box);
    });
  });

  test('User cannot access deleted box', async ({ userPage }) => {
    await test.step('Verify box is no longer visible', async () => {
      await navigation.goToPhase(userPage, roomContext.room.name, 10);
      await expect(userPage.getByText(box.name)).toBeHidden();
    });
  });
});
