import { expect, Page } from '@playwright/test';

import * as shared from '../../shared';
import { sleep } from '../../utils';
import * as roomFixtures from '../../fixtures/rooms';
import * as ideaFixtures from '../../fixtures/ideas';

const host = shared.getHost();

export const create = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData
) => {
  // start at home
  await page.goto(host);

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const AddIdeaButton = page.locator('[aria-label="add idea"]');
  await expect(AddIdeaButton).toBeVisible({ timeout: 5000 });
  await AddIdeaButton.click();

  // fill in the necessary information
  await page.fill('input[name="title"]', idea.name);
  await page.locator('div[contenteditable="true"]').fill(idea.description);

  // submit the idea form
  await page.locator('button[type="submit"]').click();

  const IdeaTitle = page.locator('h3').filter({ hasText: idea.name });
  await expect(IdeaTitle).toBeVisible();
};

export const remove = async (
  page: Page, //
  room: roomFixtures.RoomData,
  idea: ideaFixtures.IdeaData
) => {
  // start at home
  await page.goto(host);

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const IdeaDiv = page.locator(`[data-testing-id="idea-${idea.name}"]`);
  await expect(IdeaDiv).toBeVisible();

  const DotMenuDiv = IdeaDiv.locator('[data-testing-id="idea-more-menu"]');
  await expect(DotMenuDiv).toBeVisible();
  await DotMenuDiv.click();

  const DeleteButton = IdeaDiv.locator('[data-testing-id="delete-button"]');
  await expect(DeleteButton).toBeVisible({ timeout: 500 });
  await DeleteButton.click();

  const ConfirmDeleteButton = page.locator('[data-testing-id="confirm-delete"]');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click();

  const NoExistIdeaDiv = page.locator(`[data-testing-id="idea-${idea.name}"]`);
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

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const IdeaDiv = page.locator('h3').filter({ hasText: idea.name });
  await expect(IdeaDiv).toBeVisible();
  await IdeaDiv.click();

  const AddCommentButton = page.locator('[aria-label="add comment"]');
  await expect(AddCommentButton).toBeVisible();
  await AddCommentButton.click();

  await page.locator('div[contenteditable="true"]').fill(commentText);

  // submit the comment form
  await page.locator('button[type="submit"]').click();

  await sleep(2);

  const Comment = page.locator('[data-testing-id="comment-bubble"]').filter({ hasText: commentText });
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

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const IdeaDiv = page.locator('h3').filter({ hasText: idea.name });
  await expect(IdeaDiv).toBeVisible();
  await IdeaDiv.click();

  const Comment = page.locator('[data-testing-id="comment-bubble"]').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();

  const MoreOptionsButton = Comment.locator('[data-testing-id="comment-more-options"]');
  await expect(MoreOptionsButton).toBeVisible();
  await MoreOptionsButton.click();

  const DeleteButton = Comment.locator('[data-testing-id="delete-button"]');
  await expect(DeleteButton).toBeVisible({ timeout: 500 });
  await DeleteButton.click();

  const ConfirmDeleteButton = page.locator('[data-testing-id="confirm-delete"]');
  await expect(ConfirmDeleteButton).toBeVisible();
  await ConfirmDeleteButton.click();

  const NoComment = page.locator('[data-testing-id="comment-bubble"]').filter({ hasText: commentText });
  await expect(NoComment).toHaveCount(0);
};

export const approve = async (
  page: Page, //
  room: roomFixtures.RoomData,
  box: ideaFixtures.BoxData,
  idea: ideaFixtures.IdeaData
) => {
  await page.goto(host);

  const RoomDiv = page.locator('h3').filter({ hasText: room.name });
  await expect(RoomDiv).toBeVisible();
  await RoomDiv.click();

  const GoToApprovalPhaseButton = page.locator('[data-testing-id="link-to-phase-20"]');
  await expect(GoToApprovalPhaseButton).toBeVisible({ timeout: 2000 });
  await GoToApprovalPhaseButton.click();

  const BoxDiv = await page.locator('h3').filter({ hasText: box.name });
  await expect(BoxDiv).toBeVisible({ timeout: 2000 });
  await BoxDiv.click();

  const IdeaDiv = page.locator(`h3`).filter({ hasText: idea.name });
  await expect(IdeaDiv).toBeVisible();

  await IdeaDiv.click();

  await page.locator('div[contenteditable="true"]').fill('approved in automated testing');

  const ApptoveButton = page.locator(`[data-testing-id="approve-button"]`);
  await expect(ApptoveButton).toBeVisible({ timeout: 2000 });

  await ApptoveButton.click();

  const ConfirmButton = page.locator(`button`).filter({ hasText: 'Bestätigen' });
  await expect(ConfirmButton).toBeVisible({ timeout: 2000 });

  await ConfirmButton.click();
};
