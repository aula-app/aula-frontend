import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

// The countdown route to a spent phase is untestable here: back-dating phase_start needs DB access.
test('Box offers the next phase once every Idea is ruled on', async ({ seededRoom, newPageFor }) => {
  const PHASES = { DISCUSSION: 10, APPROVAL: 20, VOTING: 30 } as const;

  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const idea = entities.createIdea('advance-idea');
  const box: BoxData = entities.createBox('advance-box', seededRoom);
  box.phase = PHASES.DISCUSSION;

  const boxCard = (page: typeof adminPage) => page.getByTestId(TEST_IDS.BOX_CARD).filter({ hasText: box.name });

  await test.step('User creates an Idea in the Room', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);
  });

  await test.step('Admin creates a Box and puts the Idea in it', async () => {
    await boxes.create(adminPage, box);
    await boxes.edit(adminPage, { ...box, ideas: [idea] } as BoxData);
  });

  await test.step('Admin moves the Box into the Approval phase', async () => {
    box.phase = PHASES.APPROVAL;
    await boxes.edit(adminPage, box);
  });

  await test.step('No advance band while the Idea is still undecided', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.APPROVAL);
    await expect(boxCard(adminPage)).toBeVisible();
    await expect(boxCard(adminPage).getByTestId(TEST_IDS.ADVANCE_PHASE_BUTTON)).toBeHidden();
  });

  await test.step('Admin approves the only Idea in the Box', async () => {
    await boxes.open(adminPage, seededRoom, PHASES.APPROVAL, box);
    await ideas.approve(adminPage, idea);
  });

  await test.step('The card offers the next phase once nothing is left to rule on', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.APPROVAL);
    await expect(boxCard(adminPage).getByTestId(TEST_IDS.ADVANCE_PHASE_BUTTON)).toBeVisible();
  });

  await test.step('User without changePhase permission is never offered it', async () => {
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.APPROVAL);
    await expect(boxCard(userPage)).toBeVisible();
    await expect(boxCard(userPage).getByTestId(TEST_IDS.ADVANCE_PHASE_BUTTON)).toBeHidden();
  });

  await test.step('Cancelling the dialog leaves the Box where it is', async () => {
    await boxCard(adminPage).getByTestId(TEST_IDS.ADVANCE_PHASE_BUTTON).click();

    // Every card mounts its own closed dialog; only the open one is in the role tree.
    const dialog = adminPage.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await dialog.getByTestId(TEST_IDS.ADVANCE_PHASE_CANCEL).click();
    await expect(dialog).toBeHidden();

    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.APPROVAL);
    await expect(boxCard(adminPage)).toBeVisible();
  });

  await test.step('Confirming moves the Box into the Voting phase', async () => {
    await boxCard(adminPage).getByTestId(TEST_IDS.ADVANCE_PHASE_BUTTON).click();
    await adminPage.getByRole('alertdialog').getByTestId(TEST_IDS.ADVANCE_PHASE_CONFIRM).click();

    await expect(boxCard(adminPage)).toBeHidden();
  });

  await test.step('The Box is listed under its new phase for everyone', async () => {
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.VOTING);
    await expect(userPage.getByTestId(`box-${box.name}`)).toBeVisible();
  });
});
