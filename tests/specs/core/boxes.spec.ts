import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import { describeWithSetup } from '../../lifecycle/base-test';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from "../support/types";

describeWithSetup('Box Management - Creation, phase changes and Permissions', () => {
  let roomContext: roomsFixture.RoomContext;
  let box: BoxData;

  const boxIdea = entities.createIdea('box-idea');

  test.beforeAll(async ({ adminPage, userConfig, studentConfig }) => {
    // Setup shared room context
    roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'box-tests');

    // Create box after room context is set up
    box = entities.createBox('box-in-room', roomContext.room);
  });

  test('Admin can create a box inside a room', async ({ adminPage }) => {
    await boxes.create(adminPage, box);
  });

  test('User cannot create a box', async ({ userPage }) => {
    await expect(boxes.create(userPage, entities.createBox('unauthorized-box', roomContext.room))).rejects.toThrow();
  });

  test('User can access the new box', async ({ userPage }) => {
    await navigation.goToPhase(userPage, roomContext.room.name, 10);
    await navigation.clickOnPageItem(userPage, box.name);
    const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  // test('User can create an Idea in the box', async () => {
  //   await navigation.goToPhase(user, roomContext.room.name, 10);
  //   await navigation.clickOnPageItem(user, box.name);
  //   const boxTitle = user.getByTestId('box-card').getByText(box.name);
  //   await expect(boxTitle).toBeVisible();
  //   await ideas.create(user, boxIdea);
  // });

  test('Admin can move an Idea in the box', async ({ adminPage, userPage }) => {
    await navigation.goToRoom(userPage, roomContext.room.name);
    await ideas.create(userPage, boxIdea);

    const boxNewPhaseObject = { ...box, ideas: [boxIdea] } as BoxData;

    await navigation.goToPhase(adminPage, roomContext.room.name, 10);
    await navigation.clickOnPageItem(adminPage, box.name);
    const boxCard = adminPage.getByTestId('box-card');
    await expect(boxCard.getByText(box.name)).toBeVisible();
    await boxCard.getByTestId('more-options-button').click();
    await adminPage.waitForTimeout(500);
    await boxCard.getByTestId('edit-button').click();
    await boxes.fill(adminPage, boxNewPhaseObject);

    const boxTitle = adminPage.getByText(boxIdea.name);
    await expect(boxTitle).toBeVisible();
  });

  test('Admin can change box phase', async ({ adminPage, userPage }) => {
    const boxNewPhaseObject = { ...box, phase: 20 } as BoxData;
    await boxes.edit(adminPage, boxNewPhaseObject);

    await navigation.goToPhase(userPage, roomContext.room.name, 20);
    const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  test('Admin can delete a box', async ({ adminPage }) => {
    await boxes.remove(adminPage, box);
  });

  test('User cannot access deleted box', async ({ userPage }) => {
    await navigation.goToPhase(userPage, roomContext.room.name, 10);
    await expect(userPage.getByText(box.name)).toBeHidden();
  });
});
