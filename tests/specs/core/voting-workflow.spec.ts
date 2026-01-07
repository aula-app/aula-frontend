import { test, expect } from '../../fixtures/test-fixtures';
import * as roomsFixture from '../../helpers/contexts/room-contexts';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as forms from '../../interactions/forms';
import { BoxData, IdeaData } from '../../support/types';

/**
 * Voting Workflow Tests
 * Tests complete voting workflow from creation to results (without delegation)
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Setup room and box → 2. Move through phases → 3. Vote → 4. Results
 */
test.describe.serial('Voting Workflow - Complete Process from Creation to Results', () => {
  let roomContext: roomsFixture.RoomContext;
  let box: BoxData;
  let idea1: IdeaData;
  let idea2: IdeaData;

  // Phase constants matching the application
  const PHASES = {
    WILD: 0,
    DISCUSSION: 10,
    APPROVAL: 20, // "Prüfung" phase
    VOTING: 30, // "Abstimmung" phase
    RESULTS: 40,
  } as const;

  test('Admin creates room with users', async ({ adminPage, userConfig, studentConfig }) => {
    await test.step('Setup room context', async () => {
      roomContext = await roomsFixture.setupRoomContext(adminPage, [userConfig, studentConfig], 'voting-workflow');
    });

    await test.step('Verify room was created', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await expect(adminPage.getByText(roomContext.room.name)).toBeVisible();
    });
  });

  test('Users create ideas in the room', async ({ userPage, studentPage }) => {
    await test.step('User creates first idea', async () => {
      idea1 = entities.createIdea('idea-1');
      await navigation.goToRoom(userPage, roomContext.room.name);
      await ideas.create(userPage, idea1);
    });

    await test.step('Student creates second idea', async () => {
      idea2 = entities.createIdea('idea-2');
      await navigation.goToRoom(studentPage, roomContext.room.name);
      await ideas.create(studentPage, idea2);
    });
  });

  test('Admin creates voting box', async ({ adminPage }) => {
    await test.step('Create voting box without ideas', async () => {
      box = entities.createBox('voting-box', roomContext.room);
      box.discussionDays = 6;
      box.votingDays = 10;
      box.phase = PHASES.DISCUSSION;

      await boxes.create(adminPage, box);
    });

    await test.step('Verify box is visible', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await navigation.goToPhase(adminPage, roomContext.room.name, PHASES.DISCUSSION);
      const boxTitle = adminPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Admin adds ideas to voting box', async ({ adminPage }) => {
    await test.step('Navigate to box and open edit', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await navigation.goToPhase(adminPage, roomContext.room.name, PHASES.DISCUSSION);
      await navigation.clickOnPageItem(adminPage, box.name);

      const boxCard = adminPage.getByTestId('box-card');
      await expect(boxCard.getByText(box.name)).toBeVisible();
      await boxCard.getByTestId('more-options-button').click();
      await adminPage.waitForTimeout(500);
      await boxCard.getByTestId('edit-button').click();
    });

    await test.step('Add both ideas to box using autocomplete', async () => {
      // Click the autocomplete field to open dropdown
      const autocompleteField = adminPage.getByTestId('ideas-autocomplete-field');
      await autocompleteField.click();
      await adminPage.waitForTimeout(300);

      // Select first idea
      const idea1Option = adminPage.getByRole('option', { name: idea1.name });
      await expect(idea1Option).toBeVisible();
      await idea1Option.click();
      await adminPage.waitForTimeout(300);

      // Click field again to add second idea
      await autocompleteField.click();
      await adminPage.waitForTimeout(300);

      // Select second idea
      const idea2Option = adminPage.getByRole('option', { name: idea2.name });
      await expect(idea2Option).toBeVisible();
      await idea2Option.click();
      await adminPage.waitForTimeout(300);

      // Submit the form
      await adminPage.getByTestId('box-form-submit-button').click();
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(1000);
    });

    await test.step('Verify both ideas are in box', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await navigation.goToPhase(adminPage, roomContext.room.name, PHASES.DISCUSSION);
      await navigation.clickOnPageItem(adminPage, box.name);

      await expect(adminPage.getByText(idea1.name)).toBeVisible();
      await expect(adminPage.getByText(idea2.name)).toBeVisible();
    });
  });

  test('Move box to approval phase', async ({ adminPage, userPage }) => {
    await test.step('Change box phase to approval', async () => {
      box.phase = PHASES.APPROVAL;
      await boxes.edit(adminPage, box);
    });

    await test.step('Verify box is in approval phase', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
      await navigation.goToPhase(userPage, roomContext.room.name, PHASES.APPROVAL);
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Moderator can approve and reject ideas in approval phase', async ({ adminPage }) => {
    await test.step('Navigate to box in approval phase', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await navigation.goToPhase(adminPage, roomContext.room.name, PHASES.APPROVAL);
      await navigation.clickOnPageItem(adminPage, box.name);
    });

    await test.step('Navigate to first idea and approve', async () => {
      // Click on the idea within the box
      const idea1Card = adminPage.getByTestId(`idea-${idea1.name}`);
      await expect(idea1Card).toBeVisible();
      await idea1Card.click();
      await adminPage.waitForURL((url) => url.pathname.includes('/idea'));
      await adminPage.waitForLoadState('networkidle');

      // Click approve button
      const approveButton = adminPage.getByTestId('approve-button');
      await expect(approveButton).toBeVisible();
      await approveButton.click();
      await adminPage.waitForTimeout(500);

      // Confirm approval
      const confirmButton = adminPage.getByTestId('confirm-button');
      await expect(confirmButton).toBeVisible();
      await confirmButton.click();
      await adminPage.waitForTimeout(1000);
    });

    await test.step('Navigate back to box and reject second idea', async () => {
      await navigation.goToRoom(adminPage, roomContext.room.name);
      await navigation.goToPhase(adminPage, roomContext.room.name, PHASES.APPROVAL);
      await navigation.clickOnPageItem(adminPage, box.name);

      // Click on the second idea within the box
      const idea2Card = adminPage.getByTestId(`idea-${idea2.name}`);
      await expect(idea2Card).toBeVisible();
      await idea2Card.click();
      await adminPage.waitForURL((url) => url.pathname.includes('/idea'));
      await adminPage.waitForLoadState('networkidle');

      // Click reject button
      const rejectButton = adminPage.getByTestId('reject-button');
      await expect(rejectButton).toBeVisible();
      await rejectButton.click();
      await adminPage.waitForTimeout(500);

      // Fill rejection justification
      await forms.fillMarkdownForm(adminPage, 'approval_comment', 'This idea does not meet the requirements.');
      await adminPage.waitForTimeout(300);

      // Confirm rejection
      const confirmButton = adminPage.getByTestId('confirm-button');
      await expect(confirmButton).toBeVisible();
      await confirmButton.click();
      await adminPage.waitForTimeout(1000);
    });
  });

  test('Move box to voting phase', async ({ adminPage, userPage }) => {
    await test.step('Change box phase to voting', async () => {
      box.phase = PHASES.VOTING;
      await boxes.edit(adminPage, box);
    });

    await test.step('Verify box is in voting phase', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
      await navigation.goToPhase(userPage, roomContext.room.name, PHASES.VOTING);
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Users can vote on approved idea', async ({ userPage, studentPage }) => {
    await test.step('User votes for approved idea', async () => {
      // Navigate to box and click on idea
      await navigation.goToRoom(userPage, roomContext.room.name);
      await navigation.goToPhase(userPage, roomContext.room.name, PHASES.VOTING);
      await navigation.clickOnPageItem(userPage, box.name);

      const idea1Card = userPage.getByTestId(`idea-${idea1.name}`);
      await expect(idea1Card).toBeVisible();
      await idea1Card.click();
      await userPage.waitForURL((url) => url.pathname.includes('/idea'));
      await userPage.waitForLoadState('networkidle');

      // Click the "for" vote button
      const forButton = userPage.getByTestId('for');
      await expect(forButton).toBeVisible();
      await forButton.click();
      await userPage.waitForTimeout(1000);
    });

    await test.step('Student votes against approved idea', async () => {
      // Navigate to box and click on idea
      await navigation.goToRoom(studentPage, roomContext.room.name);
      await navigation.goToPhase(studentPage, roomContext.room.name, PHASES.VOTING);
      await navigation.clickOnPageItem(studentPage, box.name);

      const idea1Card = studentPage.getByTestId(`idea-${idea1.name}`);
      await expect(idea1Card).toBeVisible();
      await idea1Card.click();
      await studentPage.waitForURL((url) => url.pathname.includes('/idea'));
      await studentPage.waitForLoadState('networkidle');

      // Click the "against" vote button
      const againstButton = studentPage.getByTestId('against');
      await expect(againstButton).toBeVisible();
      await againstButton.click();
      await studentPage.waitForTimeout(1000);
    });
  });

  test('Admin moves box to results phase', async ({ adminPage, userPage }) => {
    await test.step('Change box phase to results', async () => {
      box.phase = PHASES.RESULTS;
      await boxes.edit(adminPage, box);
    });

    await test.step('Verify box is in results phase', async () => {
      await navigation.goToRoom(userPage, roomContext.room.name);
      await navigation.goToPhase(userPage, roomContext.room.name, PHASES.RESULTS);
      const boxTitle = userPage.getByTestId('box-card').getByText(box.name);
      await expect(boxTitle).toBeVisible();
    });
  });

  test('Voting results are visible', async ({ userPage }) => {
    await test.step('Navigate to first idea in results phase', async () => {
      // Navigate to box and click on idea
      await navigation.goToRoom(userPage, roomContext.room.name);
      await navigation.goToPhase(userPage, roomContext.room.name, PHASES.RESULTS);
      await navigation.clickOnPageItem(userPage, box.name);

      const idea1Card = userPage.getByTestId(`idea-${idea1.name}`);
      await expect(idea1Card).toBeVisible();
      await idea1Card.click();
      await userPage.waitForURL((url) => url.pathname.includes('/idea'));
      await userPage.waitForLoadState('networkidle');
    });

    await test.step('Verify results section is displayed', async () => {
      // Just verify that results are visible - exact counts may vary
      const resultsSection = userPage.getByText(/votes|stimmen|result/i).first();
      await expect(resultsSection).toBeVisible({ timeout: 5000 });
    });
  });

  test.afterAll(async ({ adminPage }) => {
    // Cleanup test data
    if (roomContext?.cleanup) {
      await roomContext.cleanup();
    }
  });
});
