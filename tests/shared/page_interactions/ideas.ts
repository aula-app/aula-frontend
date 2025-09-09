import { expect, Page } from '@playwright/test';

import * as shared from '../shared';
import { sleep } from '../utils';
import * as roomFixtures from '../../fixtures/rooms';
import * as ideaFixtures from '../../fixtures/ideas';

const host = shared.getHost();

export const goToRoom = async (
  page: Page, //
  room: roomFixtures.RoomData
) => {
  const RoomDiv = page.getByText(room.name, { exact: true });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click({ timeout: 1000 });
};

export const goToidea = async (
  page: Page, //
  idea: ideaFixtures.IdeaData
) => {
  const IdeaDiv = page.locator('h3').filter({ hasText: idea.name });
  await expect(IdeaDiv).toBeVisible();
  await IdeaDiv.click({ timeout: 1000 });
};

// goes to a specific box found on the current page
export const goToBox = async (
  page: Page, //
  box: ideaFixtures.BoxData
) => {
  const BoxDiv = await page.getByText(box.name, { exact: true });
  await expect(BoxDiv).toBeVisible();
  await BoxDiv.click({ timeout: 1000 });
};

export const goToPhase = async (
  page: Page, //
  phase: number
) => {
  const GoToApprovalPhaseButton = page.getByTestId(`link-to-phase-${phase}`);
  await expect(GoToApprovalPhaseButton).toBeVisible();
  await GoToApprovalPhaseButton.click({ timeout: 1000 });
};

export const create = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  const AddIdeaButton = page.locator('[aria-label="add idea"]');
  await expect(AddIdeaButton).toBeVisible();
  await AddIdeaButton.click({ timeout: 1000 });

  // fill in the necessary information
  await page.fill('input[name="title"]', idea.name);
  await page.locator('div[contenteditable="true"]').fill(idea.description);

  if (idea.category) {
    // how to fill in one of those MUI multiselectors:
    const SelectorId = await page.getAttribute('label:text("Kategorie")', 'for');
    const CategorySelector = page.locator(`#${shared.cssEscape(SelectorId!)}`);
    await expect(CategorySelector).toBeVisible();

    await CategorySelector.click({ timeout: 1000 });
    // click a category to the idea
    await page.getByRole('option', { name: idea.category }).first().click({ timeout: 1000 });
  }

  // submit the idea form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  const IdeaTitle = page.getByText(idea.name, { exact: true });
  await expect(IdeaTitle).toBeVisible();
};

export const remove = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  const IdeaDiv = page.getByTestId(`idea-${idea.name}`);
  await expect(IdeaDiv).toBeVisible();

  // so that any triggered tooltips dissappear
  await page.mouse.move(0, 0);

  const DotMenuDiv = IdeaDiv.getByTestId('idea-more-menu');
  await expect(DotMenuDiv).toBeVisible();
  await DotMenuDiv.click({ timeout: 1000 });

  const DeleteButton = IdeaDiv.getByTestId('delete-button');
  await expect(DeleteButton).toBeVisible({ timeout: 500 });
  await DeleteButton.click({ timeout: 1000 });

  const ConfirmDeleteButton = page.getByTestId('confirm-button');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click({ timeout: 1000 });

  const NoExistIdeaDiv = page.getByTestId(`idea-${idea.name}`);
  await expect(NoExistIdeaDiv).toHaveCount(0);
};

export const comment = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData,
  commentText: string
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  await goToidea(page, idea);

  const AddCommentButton = page.locator('[aria-label="add comment"]');
  await expect(AddCommentButton).toBeVisible();
  await AddCommentButton.click({ timeout: 1000 });

  await page.locator('div[contenteditable="true"]').fill(commentText);

  // submit the comment form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  await sleep(2);

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  const commentCount = await Comment.count();
  await expect(commentCount).toBeGreaterThan(0);
};

export const removeComment = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData,
  commentText: string
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  await goToidea(page, idea);

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();

  const MoreOptionsButton = Comment.getByTestId('comment-more-options');
  await expect(MoreOptionsButton).toBeVisible();
  await MoreOptionsButton.click({ timeout: 1000 });

  const DeleteButton = Comment.getByTestId('delete-button');
  await expect(DeleteButton).toBeVisible({ timeout: 500 });
  await DeleteButton.click({ timeout: 1000 });

  const ConfirmDeleteButton = page.getByTestId('confirm-button');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click({ timeout: 1000 });

  const NoComment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(NoComment).toHaveCount(0);
};

export const approve = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  idea: ideaFixtures.IdeaData
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 20);
  await goToBox(page, box);

  await goToidea(page, idea);

  await page.locator('div[contenteditable="true"]').fill('approved in automated testing');

  const ApptoveButton = page.getByTestId(`approve-button`);
  await expect(ApptoveButton).toBeVisible();

  await ApptoveButton.click({ timeout: 1000 });

  const ConfirmButton = page.locator(`button`).filter({ hasText: 'Bestätigen' });
  await expect(ConfirmButton).toBeVisible();

  await ConfirmButton.click({ timeout: 1000 });
};

export const vote = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  idea: ideaFixtures.IdeaData,
  vote: 'neutral' | 'for' | 'against'
) => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 30);

  await goToBox(page, box);

  await goToidea(page, idea);

  const VoteButton = page.getByTestId(`${vote}`);
  await expect(VoteButton).toBeVisible();
  await VoteButton.click({ timeout: 1000 });
};

export const totalVoteCount = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  idea: ideaFixtures.IdeaData
): Promise<number> => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 30);

  await goToBox(page, box);

  await goToidea(page, idea);

  const VoteCount = page.getByTestId(`total-votes`);
  await expect(VoteCount).toBeVisible();
  const countS = await VoteCount.textContent();

  expect(countS).toBeTruthy();

  const count = parseInt(countS!);

  return count;
};

type ForCount = number;
type AgainstCount = number;
type NeutralCount = number;

export const voteCounts = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  idea: ideaFixtures.IdeaData
): Promise<[ForCount, AgainstCount, NeutralCount]> => {
  await page.goto(host);

  await goToRoom(page, room);

  await goToPhase(page, 40);

  await goToBox(page, box);

  await goToidea(page, idea);

  const ForVoteCount = page.getByTestId(`total-votes-for`);
  await expect(ForVoteCount).toBeVisible();
  const forcountS = await ForVoteCount.textContent();
  expect(forcountS).toBeTruthy();
  const forcount = parseInt(forcountS!);

  const AgainstVoteCount = page.getByTestId(`total-votes-against`);
  await expect(AgainstVoteCount).toBeVisible();
  const AgainstcountS = await AgainstVoteCount.textContent();
  expect(AgainstcountS).toBeTruthy();
  const Againstcount = parseInt(AgainstcountS!);

  const NeutralVoteCount = page.getByTestId(`total-votes-neutral`);
  await expect(NeutralVoteCount).toBeVisible();
  const NeutralcountS = await NeutralVoteCount.textContent();
  expect(NeutralcountS).toBeTruthy();
  const Neutralcount = parseInt(NeutralcountS!);

  return [forcount, Againstcount, Neutralcount];
};

export const report = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData,
  reason: string
) => {
  await page.goto(host);

  await goToRoom(page, room);

  const IdeaDiv = page.getByTestId(`idea-${idea.name}`);
  await expect(IdeaDiv).toBeVisible();
  const DotMenuDiv = IdeaDiv.getByTestId('idea-more-menu');
  await expect(DotMenuDiv).toBeVisible();
  await DotMenuDiv.click({ timeout: 1000 });

  const ReportButton = IdeaDiv.getByTestId('report-button');
  await expect(ReportButton).toBeVisible({ timeout: 500 });
  await ReportButton.click({ timeout: 1000 });

  // how to fill in one of those MUI multiselectors:
  const SelectorId = await page.getAttribute('label:text("Berichtskategorie")', 'for');
  const ReasonSelector = page.locator(`#${shared.cssEscape(SelectorId!)}`);
  await expect(ReasonSelector).toBeVisible();

  await ReasonSelector.click({ timeout: 1000 });

  const Reason = page.locator(`li[data-value="${reason}"]`);
  await expect(Reason).toBeVisible();
  await Reason.click({ timeout: 1000 });

  await page.locator('div[contenteditable="true"]').fill('reported during automated testing');
  // submit the report form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });
};

export const checkReport = async (
  page: Page, //
  idea: ideaFixtures.IdeaData
) => {
  await page.goto(host + '/settings/reports');

  const Report = page.locator('span').filter({ hasText: idea.name });
  await expect(Report).toHaveCount(1);
};

export const checkCommentReport = async (
  page: Page, //
  comment: string
) => {
  await page.goto(host + '/settings/reports');

  const Report = page.locator('span').filter({ hasText: comment });
  await expect(Report).toHaveCount(1);
};

export const addCategory = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData,
  categoryName: string
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  // Find and click on the idea
  const IdeaDiv = page.getByTestId(`idea-${idea.name}`);
  await expect(IdeaDiv).toBeVisible();

  // Click on the more menu
  const DotMenuDiv = IdeaDiv.getByTestId('idea-more-menu');
  await expect(DotMenuDiv).toBeVisible();
  await DotMenuDiv.click({ timeout: 1000 });

  // Click edit button
  const EditButton = IdeaDiv.getByTestId('edit-button');
  await expect(EditButton).toBeVisible({ timeout: 500 });
  await EditButton.click({ timeout: 1000 });

  // Add category to the idea
  const SelectorId = await page.getAttribute('label:text("Kategorie")', 'for');
  const CategorySelector = page.locator(`#${shared.cssEscape(SelectorId!)}`);
  await expect(CategorySelector).toBeVisible();

  await CategorySelector.click({ timeout: 1000 });
  // click a category to add to the idea
  await page.getByRole('option', { name: categoryName }).first().click({ timeout: 1000 });

  // submit the idea form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  // Verify the category was added
  await sleep(1);
  const IdeaWithCategory = page.locator('div').filter({ hasText: categoryName });
  await expect(IdeaWithCategory).toBeVisible();
};

export const reportComment = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData,
  commentText: string,
  reason: string
) => {
  // start at home
  await page.goto(host);

  await goToRoom(page, room);

  await goToidea(page, idea);

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();

  const MoreOptionsButton = Comment.getByTestId('comment-more-options');
  await expect(MoreOptionsButton).toBeVisible();
  await MoreOptionsButton.click({ timeout: 1000 });

  const ReportButton = Comment.getByTestId('report-button');
  await expect(ReportButton).toBeVisible({ timeout: 500 });
  await ReportButton.click({ timeout: 1000 });

  // how to fill in one of those MUI multiselectors:
  const SelectorId = await page.getAttribute('label:text("Berichtskategorie")', 'for');
  const ReasonSelector = page.locator(`#${shared.cssEscape(SelectorId!)}`);
  await expect(ReasonSelector).toBeVisible();

  await ReasonSelector.click({ timeout: 1000 });

  const Reason = page.locator(`li[data-value="${reason}"]`);
  await expect(Reason).toBeVisible();
  await Reason.click({ timeout: 1000 });

  await page.locator('div[contenteditable="true"]').fill('reported during automated testing');
  // submit the report form
  await page.locator('button[type="submit"]').click({ timeout: 1000 });
};
