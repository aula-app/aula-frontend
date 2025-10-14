import { test, expect } from '@playwright/test';
import * as userData from '../../fixtures/users';
import { describeWithSetup } from '../../shared/base-test';
import * as entities from '../../shared/helpers/entities';
import * as browsers from '../../shared/interactions/browsers';
import * as rooms from '../../shared/interactions/rooms';
import * as boxes from '../../shared/interactions/boxes';
import * as ideas from '../../shared/interactions/ideas';
import * as navigation from '../../shared/interactions/navigation';
import { BoxData } from '../../fixtures/types';

describeWithSetup('Box Management - Creation, phase changes and Permissions', () => {
  let admin: any;
  let user: any;
  let otherUser: any;

  const room = entities.createRoom('room-tests');
  const box = entities.createBox('box-in-room', room);
  const boxIdea = entities.createIdea('box-idea');

  test.beforeAll(async () => {
    const user1Data = await userData.use('user');
    const user2Data = await userData.use('student');

    admin = await browsers.getUserBrowser('admin');
    user = await browsers.getUserBrowser(user1Data.username);
    otherUser = await browsers.getUserBrowser(user2Data.username);

    room.users = [user1Data, user2Data];
  });

  test.afterAll(async () => {
    await cleanup();
  });

  const cleanupQueue = {
    room: false,
    box: false,
  };

  const cleanup = async () => {
    if (cleanupQueue.box) {
      cleanupQueue.box = false;
      await boxes.remove(admin, box);
    }
    if (cleanupQueue.room) {
      cleanupQueue.room = false;
      await rooms.remove(admin, room);
    }
  };

  test('Admin can create a box inside a room', async () => {
    await rooms.create(admin, room);
    cleanupQueue.room = true;

    await boxes.create(admin, box); // criar box dentro da sala
    cleanupQueue.box = true;
  });

  test('User cannot create a box', async () => {
    await test.expect(boxes.create(user, entities.createBox('unauthorized-box', room))).rejects.toThrow();
  });

  test('User can access the new box', async () => {
    await navigation.goToPhase(user, room.name, 10);
    await navigation.clickOnPageItem(user, box.name);
    const boxTitle = user.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  // test('User can create an Idea in the box', async () => {
  //   await navigation.goToPhase(user, room.name, 10);
  //   await navigation.clickOnPageItem(user, box.name);
  //   const boxTitle = user.getByTestId('box-card').getByText(box.name);
  //   await expect(boxTitle).toBeVisible();
  //   await ideas.create(user, boxIdea);
  // });

  test('Admin can move an Idea in the box', async () => {
    await navigation.goToRoom(user, room.name);
    await ideas.create(user, boxIdea);

    const boxNewPhaseObject = { ...box, ideas: [boxIdea] } as BoxData;

    await navigation.goToPhase(admin, room.name, 10);
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

    await navigation.goToPhase(user, room.name, 20);
    const boxTitle = user.getByTestId('box-card').getByText(box.name);
    await expect(boxTitle).toBeVisible();
  });

  test('Admin can delete a box', async () => {
    await boxes.remove(admin, box);
    cleanupQueue.box = false;
  });

  test('User cannot access deleted box', async () => {
    await navigation.goToPhase(user, room.name, 10);
    await expect(user.getByText(box.name)).toBeHidden();
  });
});
