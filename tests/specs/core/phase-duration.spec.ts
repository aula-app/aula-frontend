import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as navigation from '../../interactions/navigation';
import * as settings from '../../interactions/settings';
import { BoxData } from '../../support/types';

/**
 * Phase Duration Regression (issue #543)
 *
 * The box phase countdown must run from when the *current* phase started, not
 * accumulate the durations of earlier phases from the creation date. After a
 * box is advanced to Voting, its countdown must reset to ~votingDays instead of
 * showing discussion + approval + voting.
 *
 * The explicit "time has passed" scenario is covered deterministically in the
 * backend test (TopicPhaseStartTest back-dates phase_start); here we assert the
 * user-visible result: advancing phases does not accumulate the countdown.
 */
test('Phase countdown resets on phase change and does not accumulate (#543)', async ({ seededRoom, newPageFor }) => {
  const PHASES = { DISCUSSION: 10, VOTING: 30 } as const;

  const adminPage = await newPageFor('admin');

  const box: BoxData = entities.createBox('phase-duration-box', seededRoom);
  box.discussionDays = 6;
  box.votingDays = 10;
  box.phase = PHASES.DISCUSSION;

  // Reads the integer from the BoxCard countdown ("Phase ends in N days" /
  // "Phase endet in N Tagen"), locale-agnostically.
  const readPhaseDays = async (page: typeof adminPage, boxName: string): Promise<number> => {
    const card = page.getByTestId(TEST_IDS.BOX_CARD).filter({ hasText: boxName });
    await expect(card).toBeVisible();
    const text = await card.innerText();
    const match = text.match(/(\d+)\s*(days|Tagen)/i);
    expect(match, `countdown not found in box card text: "${text}"`).not.toBeNull();
    return Number(match![1]);
  };

  await test.step('Admin creates a Box in the Discussion phase', async () => {
    await boxes.create(adminPage, box);
  });

  await test.step('Discussion countdown reflects discussionDays', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.DISCUSSION);
    const days = await readPhaseDays(adminPage, box.name);
    expect(days).toBeGreaterThanOrEqual(5);
    expect(days).toBeLessThanOrEqual(6);
  });

  await test.step('Admin advances the Box to the Voting phase', async () => {
    box.phase = PHASES.VOTING;
    await boxes.edit(adminPage, box);
  });

  await test.step('Voting countdown resets to votingDays (no accumulation)', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.VOTING);
    const days = await readPhaseDays(adminPage, box.name);
    // With the bug, this would be discussion + approval + voting (>= 14).
    expect(days).toBeLessThan(14);
    expect(days).toBeGreaterThanOrEqual(8);
    expect(days).toBeLessThanOrEqual(10);
  });
});

/**
 * Box Editing View phase duration persistence (issue #1221)
 *
 * Reopening the Box editing view for an existing box must show the durations
 * that were saved, not fall back to the room/system default. The bug: BoxForms
 * seeded the form with a hardcoded 0, so the falsy guard in PhaseDurationFields
 * did not skip and overwrote the saved value with the room default (e.g. 14).
 *
 * Uses distinctive, non-default values (9 / 22) so a regression that reverts to
 * the room default would produce a different number and fail the assertion.
 */
test('Box editing view keeps saved phase durations on reopen (#1221)', async ({ seededRoom, newPageFor }) => {
  const DISCUSSION_DAYS = 9;
  const VOTING_DAYS = 22;

  const adminPage = await newPageFor('admin');

  const box: BoxData = entities.createBox('phase-duration-persist-box', seededRoom);
  box.discussionDays = DISCUSSION_DAYS;
  box.votingDays = VOTING_DAYS;
  box.phase = 10;

  await test.step('Admin creates a Box with custom phase durations', async () => {
    await boxes.create(adminPage, box);
  });

  await test.step('Reopening the edit view shows the saved durations, not the default', async () => {
    await navigation.goToBoxesSettings(adminPage);
    await settings.openEdit({ page: adminPage, filters: { option: 'name', value: box.name } });

    const discussionInput = adminPage.getByTestId('phase_duration_1-input');
    const votingInput = adminPage.getByTestId('phase_duration_3-input');
    await expect(discussionInput).toBeVisible();

    expect(await discussionInput.inputValue()).toBe(String(DISCUSSION_DAYS));
    expect(await votingInput.inputValue()).toBe(String(VOTING_DAYS));
  });
});
