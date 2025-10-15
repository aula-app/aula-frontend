import { test, expect } from '@playwright/test';
import * as userData from '../../fixtures/users';
import * as rooms from '../../fixtures/rooms';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as boxes from '../../shared/interactions/boxes';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import { BoxData } from '../../fixtures/types';

describeWithSetup('Box Management - Creation, phase changes and Permissions', () => {
  let admin: any;
  let user: any;
  let otherUser: any;
  let roomContext: rooms.RoomContext;
  let box: BoxData;

  const boxIdea = entities.createIdea('box-idea');

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('student');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);
    otherUser = await browsers.getUserBrowser(user2Data.username);

    // Setup shared room context
    roomContext = await rooms.setupRoomContext(admin, [user1Data, user2Data], 'box-tests');

    // Create box after room context is set up
    box = entities.createBox('box-in-room', roomContext.room);
  });

  test.afterAll(async () => {
    await cleanup();
  });

  const cleanupQueue = {
    box: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.box) {
      cleanupQueue.box = false;
      await boxes.remove(admin, box);
    }
    // Cleanup room context
    await roomContext.cleanup();
  };

  test('Admin can create a box inside a room', async () => {
    await boxes.create(admin, box);
    cleanupQueue.box = true;
  });

  test('User cannot create a box', async () => {
    await test.expect(boxes.create(user, entities.createBox('unauthorized-box', roomContext.room))).rejects.toThrow();
  });

  test('User can access the new box', async () => {
    await navigation.goToPhase(user, roomContext.room.name, 10);
    await navigation.clickOnPageItem(user, box.name);
    const boxTitle = user.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  // test('User can create an Idea in the box', async () => {
  //   await navigation.goToPhase(user, roomContext.room.name, 10);
  //   await navigation.clickOnPageItem(user, box.name);
  //   const boxTitle = user.getByTestId('box-card').getByText(box.name);
  //   await expect(boxTitle).toBeVisible();
  //   await ideas.create(user, boxIdea);
  // });

  test('Admin can move an Idea in the box', async () => {
    await navigation.goToRoom(user, roomContext.room.name);
    await ideas.create(user, boxIdea);

    const boxNewPhaseObject = { ...box, ideas: [boxIdea] } as BoxData;

    await navigation.goToPhase(admin, roomContext.room.name, 10);
    await navigation.clickOnPageItem(admin, box.name);
    const boxCard = admin.getByTestId('box-card');
    await expect(boxCard.getByText(box.name)).toBeVisible();
    await boxCard.getByTestId('more-options').click();
    await admin.waitForTimeout(500);
    await boxCard.getByTestId('edit-button').click();
    await boxes.fill(admin, boxNewPhaseObject);

    const boxTitle = admin.getByText(boxIdea.name);
    await expect(boxTitle).toBeVisible();
  });

  test('Admin can change box phase', async () => {
    const boxNewPhaseObject = { ...box, phase: 20 } as BoxData;
    await boxes.edit(admin, boxNewPhaseObject);

    await navigation.goToPhase(user, roomContext.room.name, 20);
    const boxTitle = user.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  test('Admin can delete a box', async () => {
    await boxes.remove(admin, box);
    cleanupQueue.box = false;
  });

  test('User cannot access deleted box', async () => {
    await navigation.goToPhase(user, roomContext.room.name, 10);
    await expect(user.getByText(box.name)).toBeHidden();
  });
});
