import { expect, test } from '../../fixtures/db-backchannel/new-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

/**
 * Box Management Tests
 * Tests box creation, phase changes, permissions, and idea movement
 * Uses pure Playwright fixtures for setup/teardown
 */
test.describe('Box Management - Creation, phase changes and Permissions', () => {

  test('Unprivileged User cannot create a Box', async ({ seededRoom, newPageFor }) => {
    const box = entities.createBox('unprivileged-box', seededRoom)
    const userPage = await newPageFor('user');

    // TODO: expect can't create Box from Room page
    // TODO: expect can't access Box Settings page
    //
    // this doesn't work:
    // await expect(boxes.create(userPage, box)).rejects.toThrow();
  });

  test('Admin adds a Box to a Room; User adds Idea to it', async ({ seededRoom, newPageFor }) => {
    const adminPage = await newPageFor('admin');
    const userPage = await newPageFor('user');

    const box = entities.createBox('box-in-room', seededRoom);
    const boxIdea = entities.createIdea('idea-created-straght-in-a-box');

    await test.step('Admin can create a Box in existing Room via UI', async () => {
      await boxes.create(adminPage, box);
    });

    await test.step('User can navigate to created Box, in phase 10', async () => {
      await navigation.goToRoomPhase(userPage, seededRoom.name, 10);
      await navigation.clickOnPageItem(userPage, box.name);
    });

    await test.step('User can read the Box title', async () => {
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });

    await test.step('User can create an Idea in the Box', async () => {
      await ideas.create(userPage, boxIdea);
    });
  });

  test('User adds Idea to Room; Admin assigns it into a Box', async ({ seededRoom, newPageFor }) => {
    const userPage = await newPageFor('user');
    const adminPage = await newPageFor('admin');

    const box = entities.createBox('box-2-in-room', seededRoom);
    const idea = entities.createIdea('idea-goes-to-box-later');

    await test.step('User creates an Idea in Room', async () => {
      await navigation.goToRoom(userPage, seededRoom.name);
      await ideas.create(userPage, idea);
    });

    await test.step('Admin creates a Box in Room via UI', async () => {
      await boxes.create(adminPage, box);
    });

    await test.step('Admin assigns Idea to a Box', async () => {
      const boxNewPhaseObject = { ...box, ideas: [idea] } as BoxData;

      await navigation.goToRoomPhase(adminPage, seededRoom.name, 10);
      await navigation.clickOnPageItem(adminPage, box.name);
      const boxCard = adminPage.getByTestId('box-card');
      await expect(boxCard.getByText(box.name)).toBeVisible();
      await boxCard.getByTestId('more-options-button').click();
      await expect(boxCard.getByTestId('edit-button')).toBeVisible();
      await boxCard.getByTestId('edit-button').click();
      await boxes.fill(adminPage, boxNewPhaseObject);
    });

    await test.step('Admin verify Idea is in Box', async () => {
      const boxTitle = adminPage.getByText(idea.name);
      await expect(boxTitle).toBeVisible();
    });

    await test.step('Admin change Box phase to 20', async () => {
      const boxNewPhaseObject = { ...box, phase: 20 } as BoxData;
      await boxes.edit(adminPage, boxNewPhaseObject);
    });

    await test.step('User verify Box is in new phase', async () => {
      await navigation.goToRoomPhase(userPage, seededRoom.name, 20);
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });

    await test.step('Admin delete Box via settings', async () => {
      await boxes.remove(adminPage, box);
    });

    await test.step('User verify Box is no longer visible', async () => {
      await navigation.goToRoomPhase(userPage, seededRoom.name, 10);
      await expect(userPage.getByText(box.name)).toBeHidden();
    });
  });
});
