import { expect, Page } from '@playwright/test';

import * as shared from '../shared';
import { sleep } from '../utils';
import * as roomFixtures from '../../fixtures/rooms';
import * as ideaFixtures from '../../fixtures/ideas';
import * as userFixtures from '../../fixtures/users';
import { goToBox, goToPhase, goToRoom } from './ideas';

const host = shared.getHost();

export const create = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, box.phase);

  const AddBoxButton = page.locator('[aria-label="add idea"]'); // aria label should
  //  probably be add box
  await expect(AddBoxButton).toBeVisible({ timeout: 2000 });
  await AddBoxButton.click({ timeout: 1000 });

  // fill in the necessary information
  await page.fill('input[name="name"]', box.name);
  await page.locator('div[contenteditable="true"]').fill(box.description);

  // select the correct phase for the box
  const phaseComboboxId = await page.getAttribute('label:text("Phase")', 'for');
  const PhaseCombobox = page.locator(`#${shared.cssEscape(phaseComboboxId)}`);
  await expect(PhaseCombobox).toBeVisible({ timeout: 2000 });
  await PhaseCombobox.click({ timeout: 1000 });
  const Selection = page.locator(`[data-value="${box.phase}"]`);
  await Selection.click({ timeout: 1000 });

  await page.fill('input[name="phase_duration_1"]', box.discussionDays.toString());
  await page.fill('input[name="phase_duration_3"]', box.discussionDays.toString());

  // how to fill in one of those MUI multiselectors:
  const SelectorId = await page.getAttribute('label:text("Ideen")', 'for');
  const IdeaSelector = page.locator(`#${shared.cssEscape(SelectorId)}`);
  await expect(IdeaSelector).toBeVisible({ timeout: 2000 });

  await IdeaSelector.click({ timeout: 1000 });

  // click and add each desired user to the room
  for (const i of box.ideas) {
    await page.getByRole('option', { name: i.name }).click({ timeout: 1000 });
    await IdeaSelector.click({ timeout: 1000 });
  }

  // submit the room form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  // OMG
  await sleep(3);

  // was the box created?
  const BoxDiv = page.locator('h3').filter({ hasText: box.name });
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });
};

export const remove = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData
) => {
  await page.goto(host);

  await goToRoom(page, room);

  const GoToDiscussionPhaseButton = page.getByTestId('link-to-phase-10');
  await expect(GoToDiscussionPhaseButton).toBeVisible({ timeout: 2000 });
  await GoToDiscussionPhaseButton.click({ timeout: 1000 });

  const BoxDiv = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });

  // so that any triggered tooltips dissappear
  await page.mouse.move(0, 0);

  const MoreOptions = BoxDiv.getByTestId('more-options');
  await expect(MoreOptions).toBeVisible({ timeout: 2000 });

  await MoreOptions.click({ timeout: 1000 });

  const DeleteButton = BoxDiv.getByTestId('delete-button');
  await expect(DeleteButton).toBeVisible({ timeout: 2000 });

  await DeleteButton.click({ timeout: 1000 });

  const ConfirmDeleteButton = page.getByTestId('confirm-button');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click({ timeout: 1000 });

  const NoExistBoxDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(NoExistBoxDiv).toHaveCount(0);
};

export const move = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  fromPhase: number,
  toPhase: number
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, fromPhase);

  const BoxDiv = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });

  // so that any triggered tooltips dissappear
  await page.mouse.move(0, 0);

  const MoreOptions = BoxDiv.getByTestId('more-options');
  await expect(MoreOptions).toBeVisible({ timeout: 2000 });

  await MoreOptions.click({ timeout: 1000 });

  const EditButton = BoxDiv.getByTestId('edit-button');
  await expect(EditButton).toBeVisible({ timeout: 2000 });

  await page.mouse.move(0, 0);

  await EditButton.click({ timeout: 1000 });

  // select the correct phase for the box
  const phaseComboboxId = await page.getAttribute('label:text("Phase")', 'for');
  const PhaseCombobox = page.locator(`#${shared.cssEscape(phaseComboboxId)}`);
  await expect(PhaseCombobox).toBeVisible({ timeout: 2000 });
  await PhaseCombobox.click({ timeout: 1000 });
  const Selection = page.locator(`[data-value="${toPhase}"]`);

  await page.mouse.move(0, 0);

  await Selection.click({ timeout: 1000 });

  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  const GoToDiscussionPhaseButton2 = page.getByTestId(`link-to-phase-${toPhase}`);
  await expect(GoToDiscussionPhaseButton2).toBeVisible({ timeout: 2000 });
  await GoToDiscussionPhaseButton2.click({ timeout: 1000 });

  const BoxDiv2 = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv2).toBeVisible({ timeout: 2000 });
};

export const delegateVotes = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  toUser: userFixtures.UserData
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 30);

  await goToBox(page, box);

  const DelegateButton = page.locator('button').filter({ hasText: 'Stimme übertragen' });
  await expect(DelegateButton).toBeVisible();

  await DelegateButton.click({ timeout: 1000 });

  const ToUserButton = page.locator('button').filter({ hasText: toUser.realName });
  await expect(ToUserButton).toBeVisible();

  await ToUserButton.click({ timeout: 1000 });

  const ConfirmButton = page.getByTestId('delegate-vote-button');
  await expect(ConfirmButton).toBeVisible();

  await ConfirmButton.click({ timeout: 1000 });

  const delegationtext = `${toUser.displayName} kann für dich abstimmen`;
  const DelegationFlag = page.locator('span').filter({ hasText: delegationtext });
  await expect(DelegationFlag).toBeVisible();
};

export const unDelegateVotes = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 30);

  await goToBox(page, box);

  const UnDelegateButton = page.locator('button').filter({ hasText: 'Delegation widerrufen' });
  await expect(UnDelegateButton).toBeVisible();

  await UnDelegateButton.click({ timeout: 1000 });

  const ConfirmButton = page.getByTestId('revoke-delegation-button');
  await expect(ConfirmButton).toBeVisible();
  await ConfirmButton.click({ timeout: 1000 });

  const DelegateButton = page.locator('button').filter({ hasText: 'Stimme übertragen' });
  await expect(DelegateButton).toBeVisible();
};

export const hasDelegatedVotes = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 30);

  await goToBox(page, box);

  const MultipleVoteFlag = page.locator('span').filter({ hasText: 'Du stimmst für mehrere Personen hier ab' });
  await expect(MultipleVoteFlag).toBeVisible();
};
