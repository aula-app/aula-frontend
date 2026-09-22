import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as formInteractions from '../../interactions/forms';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

/**
 * Box Management Tests
 * Tests box creation, phase changes, permissions, and idea movement
 * Uses pure Playwright fixtures for setup/teardown
 */
test.describe('Box Management - Creation, phase changes and Permissions', () => {

  test.skip('Unprivileged User cannot create a Box', async ({ seededRoom, newPageFor }) => {
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

    // Assignment from the box card's own dialog is covered below.
    await test.step('Admin assigns Idea to a Box', async () => {
      const boxNewPhaseObject = { ...box, ideas: [idea] } as BoxData;

      await boxes.edit(adminPage, boxNewPhaseObject);
    });

    await test.step('Admin verify Idea is in Box', async () => {
      await navigation.goToRoomPhase(adminPage, seededRoom.name, 10);
      await navigation.clickOnPageItem(adminPage, box.name);

      const boxTitle = adminPage.getByText(idea.name).filter({ visible: true });
      await expect(boxTitle).toBeVisible();
    });

    await test.step('Admin change Box phase to 20', async () => {
      const boxNewPhaseObject = { ...box, phase: 20 } as BoxData;
      await boxes.edit(adminPage, boxNewPhaseObject);
    });

    await test.step('User verify Box is in new phase', async () => {
      await navigation.goToRoomPhase(userPage, seededRoom.name, 20);
      const boxTitle = userPage.getByTestId(`box-${box.name}`);
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

  // The room only offers ideas no box holds, so being pickable again proves the detach landed.
  test('Admin assigns and removes Ideas from the Box card', async ({ seededRoom, newPageFor }) => {
    const userPage = await newPageFor('user');
    const adminPage = await newPageFor('admin');

    const box = entities.createBox('box-card-assignment', seededRoom);
    const keptIdea = entities.createIdea('stays-in-the-box');
    const droppedIdea = entities.createIdea('leaves-the-box');

    const openEditDialog = async () => {
      const card = adminPage.getByTestId(TEST_IDS.BOX_CARD).filter({ hasText: box.name });
      await card.getByTestId(TEST_IDS.BOX_MORE_MENU).click();
      await card.getByTestId(TEST_IDS.EDIT_BUTTON).click();
      await expect(adminPage.getByTestId('box-form')).toBeVisible();
    };

    // The picked ideas are the only plain list in the form; the autocomplete's is a listbox.
    const pickedIdeas = () => adminPage.getByTestId('box-form').getByRole('list');

    await test.step('User creates two Ideas in the Room', async () => {
      await navigation.goToRoom(userPage, seededRoom.name);
      await ideas.create(userPage, keptIdea);
      await ideas.create(userPage, droppedIdea);
    });

    await test.step('Admin creates an empty Box in the Room', async () => {
      await boxes.create(adminPage, box);
    });

    await test.step('Admin adds both Ideas from the Box card edit dialog', async () => {
      await boxes.open(adminPage, seededRoom, 10, box);
      await openEditDialog();

      await formInteractions.pickAutocompleteOption(adminPage, 'box-form-ideas', keptIdea.name);
      await formInteractions.pickAutocompleteOption(adminPage, 'box-form-ideas', droppedIdea.name);
      await expect(pickedIdeas().getByRole('listitem')).toHaveCount(2);

      await formInteractions.clickButton(adminPage, 'box-form-submit');
      await expect(adminPage.getByTestId('box-form')).toBeHidden();
    });

    await test.step('Both Ideas are in the Box', async () => {
      await boxes.open(adminPage, seededRoom, 10, box);
      await expect(adminPage.getByTestId(`idea-${keptIdea.name}`)).toBeVisible();
      await expect(adminPage.getByTestId(`idea-${droppedIdea.name}`)).toBeVisible();
    });

    await test.step('Admin removes one Idea in the same dialog', async () => {
      await openEditDialog();
      await expect(pickedIdeas().getByRole('listitem')).toHaveCount(2);

      await pickedIdeas().getByRole('listitem').filter({ hasText: droppedIdea.name }).getByRole('button').click();
      await expect(pickedIdeas().getByRole('listitem')).toHaveCount(1);

      await formInteractions.clickButton(adminPage, 'box-form-submit');
      await expect(adminPage.getByTestId('box-form')).toBeHidden();
    });

    await test.step('Only the kept Idea is left in the Box', async () => {
      await boxes.open(adminPage, seededRoom, 10, box);
      await expect(adminPage.getByTestId(`idea-${keptIdea.name}`)).toBeVisible();
      await expect(adminPage.getByTestId(`idea-${droppedIdea.name}`)).toHaveCount(0);
    });

    await test.step('The removed Idea can be picked again', async () => {
      await openEditDialog();

      const field = adminPage.getByTestId('box-form-ideas');
      await field.fill(droppedIdea.name);
      await expect(adminPage.getByRole('option', { name: droppedIdea.name })).toBeVisible();

      await formInteractions.clickButton(adminPage, 'box-form-cancel');
      await expect(adminPage.getByTestId('box-form')).toBeHidden();
    });
  });
});
