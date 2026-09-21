import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

/**
 * Voting Workflow Tests
 * Tests complete voting workflow from creation to results (without delegation)
 */
test('Voting Workflow', async ({ seededRoom, newPageFor }) => {
  // Phase constants matching the application
  const PHASES = {
    WILD: 0,
    DISCUSSION: 10,
    APPROVAL: 20, // "Prüfung" phase
    VOTING: 30, // "Abstimmung" phase
    RESULTS: 40,
  } as const;

  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');

  const idea1 = entities.createIdea('idea-1');
  const idea2 = entities.createIdea('idea-2');
  const box: BoxData = entities.createBox('voting-box', seededRoom);
  box.discussionDays = 6;
  box.votingDays = 10;
  box.phase = PHASES.DISCUSSION;

  await test.step('User creates Idea-1 in existing Room', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea1);
  });

  await test.step('Student creates Idea-2 in existing Room', async () => {
    await navigation.goToRoom(studentPage, seededRoom.name);
    await ideas.create(studentPage, idea2);
  });

  await test.step('Admin creates voting Box without Ideas', async () => {
    // Create a Box from admin Box Settings page
    await boxes.create(adminPage, box);
  });

  await test.step('Admin can see the Box inside the Room', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.DISCUSSION);
    const boxTitle = adminPage.getByTestId(`box-${box.name}`);
    await expect(boxTitle).toBeVisible();
  });

  await test.step('Admin can edit the Box', async () => {
    await navigation.clickOnPageItem(adminPage, box.name);

    const boxCard = adminPage.getByTestId(TEST_IDS.BOX_CARD);
    await expect(boxCard.getByText(box.name)).toBeVisible();
    await boxCard.getByTestId(TEST_IDS.BOX_MORE_MENU).click();
    await expect(boxCard.getByTestId('edit-button')).toBeVisible();
    await boxCard.getByTestId('edit-button').click();

    await expect(adminPage.getByTestId('box-form')).toBeVisible();
    await adminPage.getByTestId('box-form-cancel').click();
  });

  // Assigning existing Ideas to a Box lives in Settings; the box card's edit dialog
  // only covers room/name/description/phase.
  await test.step("Admin adds both user's Ideas to Box", async () => {
    await boxes.edit(adminPage, { ...box, ideas: [idea1, idea2] } as BoxData);
  });

  await test.step('Admin verify both Ideas are in Box', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.DISCUSSION);
    await navigation.clickOnPageItem(adminPage, box.name);

    await expect(adminPage.getByText(idea1.name).filter({ visible: true })).toBeVisible();
    await expect(adminPage.getByText(idea2.name).filter({ visible: true })).toBeVisible();
  });

  await test.step('Change box phase to approval', async () => {
    box.phase = PHASES.APPROVAL;
    await boxes.edit(adminPage, box);
  });

  await test.step('Verify box is in approval phase', async () => {
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.APPROVAL);
    const boxTitle = userPage.getByTestId(`box-${box.name}`);
    await expect(boxTitle).toBeVisible();
  });

  // @TODO: implement auditor
  await test.step('Auditor navigates to Box in approval phase', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.APPROVAL);
    await navigation.clickOnPageItem(adminPage, box.name);
  });

  await test.step('Navigate to first idea and approve', async () => {
    // Click on the idea within the box
    const idea1Card = adminPage.getByTestId(`idea-${idea1.name}`);
    await expect(idea1Card).toBeVisible();
    await idea1Card.click();
    await adminPage.waitForURL((url) => url.pathname.includes('/idea'));

    // Approving takes effect on click — only a rejection asks for anything further
    const approveButton = adminPage.getByTestId(TEST_IDS.APPROVE_BUTTON);
    await expect(approveButton).toBeVisible();
    await approveButton.click();
    await expect(approveButton).toHaveAttribute('aria-pressed', 'true');
  });

  await test.step('Navigate back to box and reject second idea', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.APPROVAL);
    await navigation.clickOnPageItem(adminPage, box.name);

    // Click on the second idea within the box
    const idea2Card = adminPage.getByTestId(`idea-${idea2.name}`);
    await expect(idea2Card).toBeVisible();
    await idea2Card.click();
    await adminPage.waitForURL((url) => url.pathname.includes('/idea'));

    // Rejecting goes through a dialog: the argument is required before it is written
    const rejectButton = adminPage.getByTestId(TEST_IDS.REJECT_BUTTON);
    await expect(rejectButton).toBeVisible();
    await rejectButton.click();

    await adminPage
      .getByTestId('rejection-form-comment')
      .locator('[contenteditable="true"]')
      .fill('This idea does not meet the requirements.');

    await adminPage.getByTestId('rejection-form-submit').click();
    await expect(rejectButton).toHaveAttribute('aria-pressed', 'true');
  });

  await test.step('Admin change Box phase to voting', async () => {
    box.phase = PHASES.VOTING;
    await boxes.edit(adminPage, box);
  });

  await test.step('Verify box is in voting phase', async () => {
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.VOTING);
    const boxTitle = userPage.getByTestId(`box-${box.name}`);
    await expect(boxTitle).toBeVisible();
  });

  await test.step('User votes for approved idea', async () => {
    // Navigate to box and click on idea
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.VOTING);
    await navigation.clickOnPageItem(userPage, box.name);

    const idea1Card = userPage.getByTestId(`idea-${idea1.name}`);
    await expect(idea1Card).toBeVisible();
    await idea1Card.click();
    await userPage.waitForURL((url) => url.pathname.includes('/idea'));

    // Click the "for" vote button
    const forButton = userPage.getByTestId('for');
    await expect(forButton).toBeVisible();
    await forButton.click();
  });

  await test.step('Student votes against approved idea', async () => {
    // Navigate to box and click on idea
    await navigation.goToRoomPhase(studentPage, seededRoom.name, PHASES.VOTING);
    await navigation.clickOnPageItem(studentPage, box.name);

    const idea1Card = studentPage.getByTestId(`idea-${idea1.name}`);
    await expect(idea1Card).toBeVisible();
    await idea1Card.click();
    await studentPage.waitForURL((url) => url.pathname.includes('/idea'));

    // Click the "against" vote button
    const againstButton = studentPage.getByTestId('against');
    await expect(againstButton).toBeVisible();
    await againstButton.click();
  });

  await test.step('Admin change box phase to results', async () => {
    box.phase = PHASES.RESULTS;
    await boxes.edit(adminPage, box);
  });

  await test.step('Verify box is in results phase', async () => {
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.RESULTS);
    const boxTitle = userPage.getByTestId(`box-${box.name}`);
    await expect(boxTitle).toBeVisible();
  });

  await test.step('Navigate to first idea in results phase', async () => {
    // Navigate to box and click on idea
    await navigation.goToRoom(userPage, seededRoom.name);
    await navigation.goToRoomPhase(userPage, seededRoom.name, PHASES.RESULTS);
    await navigation.clickOnPageItem(userPage, box.name);

    const idea1Card = userPage.getByTestId(`idea-${idea1.name}`);
    await expect(idea1Card).toBeVisible();
    await idea1Card.click();
    await userPage.waitForURL((url) => url.pathname.includes('/idea'));
  });

  await test.step('Verify results section is displayed', async () => {
    // The distribution itself — exact counts may vary, so only its presence is asserted
    await expect(userPage.getByTestId(TEST_IDS.VOTE_RESULTS)).toBeVisible();
  });
});
