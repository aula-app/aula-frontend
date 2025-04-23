import { expect, Page } from '@playwright/test';

import * as shared from '../../shared';
import { sleep } from '../../utils';
import * as roomFixtures from '../../fixtures/rooms';
import * as ideaFixtures from '../../fixtures/ideas';

const host = shared.getHost();

export const create = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData
) => {
  // start at home
  await page.goto(host);

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible({ timeout: 2000 });
  await RoomDiv.click();

  const GoToDiscussionPhaseButton = page.locator(`[data-testing-id="link-to-phase-${box.phase}"]`);
  await expect(GoToDiscussionPhaseButton).toBeVisible({ timeout: 2000 });
  await GoToDiscussionPhaseButton.click();

  const AddBoxButton = page.locator('[aria-label="add idea"]'); // aria label should
  //  probably be add box
  await expect(AddBoxButton).toBeVisible({ timeout: 2000 });
  await AddBoxButton.click();

  // fill in the necessary information
  await page.fill('input[name="name"]', box.name);
  await page.locator('div[contenteditable="true"]').fill(box.description);

  // select the correct phase for the box
  const phaseComboboxId = await page.getAttribute('label:text("Phase")', 'for');
  const PhaseCombobox = page.locator(`#${shared.cssEscape(phaseComboboxId)}`);
  await expect(PhaseCombobox).toBeVisible({ timeout: 2000 });
  await PhaseCombobox.click();
  const Selection = page.locator(`[data-value="${box.phase}"]`);
  await Selection.click();

  await page.fill('input[name="phase_duration_1"]', box.discussionDays.toString());
  await page.fill('input[name="phase_duration_3"]', box.discussionDays.toString());

  // how to fill in one of those MUI multiselectors:
  const SelectorId = await page.getAttribute('label:text("Ideen")', 'for');
  const IdeaSelector = page.locator(`#${shared.cssEscape(SelectorId)}`);
  await expect(IdeaSelector).toBeVisible({ timeout: 2000 });

  await IdeaSelector.click();

  // click and add each desired user to the room
  for (const i of box.ideas) {
    await page.getByRole('option', { name: i.name }).click();
    await IdeaSelector.click();
  }

  // submit the room form
  await page.locator('button[type="submit"]').click();

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

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const GoToDiscussionPhaseButton = page.locator('[data-testing-id="link-to-phase-10"]');
  await expect(GoToDiscussionPhaseButton).toBeVisible({ timeout: 2000 });
  await GoToDiscussionPhaseButton.click();

  const BoxDiv = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });

  const MoreOptions = BoxDiv.locator('[data-testing-id="more-options"]');
  await expect(MoreOptions).toBeVisible({ timeout: 2000 });

  await MoreOptions.click();

  const DeleteButton = BoxDiv.locator('[data-testing-id="delete-button"]');
  await expect(DeleteButton).toBeVisible({ timeout: 2000 });

  await DeleteButton.click();

  const ConfirmDeleteButton = page.locator('[data-testing-id="confirm-delete"]');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click();

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

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const GoToPhaseButton1 = page.locator(`[data-testing-id="link-to-phase-${fromPhase}"]`);
  await expect(GoToPhaseButton1).toBeVisible({ timeout: 2000 });
  await GoToPhaseButton1.click();

  const BoxDiv = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });

  const MoreOptions = BoxDiv.locator('[data-testing-id="more-options"]');
  await expect(MoreOptions).toBeVisible({ timeout: 2000 });

  await MoreOptions.click();

  const EditButton = BoxDiv.locator('[data-testing-id="edit-button"]');
  await expect(EditButton).toBeVisible({ timeout: 2000 });

  await EditButton.click();

  // select the correct phase for the box
  const phaseComboboxId = await page.getAttribute('label:text("Phase")', 'for');
  const PhaseCombobox = page.locator(`#${shared.cssEscape(phaseComboboxId)}`);
  await expect(PhaseCombobox).toBeVisible({ timeout: 2000 });
  await PhaseCombobox.click();
  const Selection = page.locator(`[data-value="${toPhase}"]`);
  await Selection.click();

  await page.locator('button[type="submit"]').click();

  const GoToDiscussionPhaseButton2 = page.locator(`[data-testing-id="link-to-phase-${toPhase}"]`);
  await expect(GoToDiscussionPhaseButton2).toBeVisible({ timeout: 2000 });
  await GoToDiscussionPhaseButton2.click();

  const BoxDiv2 = await page.locator('h3').filter({ hasText: box.name }).locator('xpath=ancestor::div[3]');
  await expect(BoxDiv2).toBeVisible({ timeout: 2000 });
};
