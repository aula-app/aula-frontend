import { expect, Page } from '@playwright/test';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';
import { TIMEOUTS } from '../support/timeouts';

export const create = async (
  page: Page, //
  idea: types.IdeaData
) => {
  // start at home
  await formInteractions.clickButton(page, 'add-idea-button');
  await page.waitForSelector('[data-testid="add-idea-form"]', { state: 'visible', timeout: 500 });

  // fill in the necessary information
  await formInteractions.fillForm(page, 'idea-title', idea.name);
  await formInteractions.fillMarkdownForm(page, 'content', idea.description);

  if (idea.box) {
    // how to fill in one of those MUI multiselectors:
    const BoxSelector = page.getByTestId('box-field-select-input');
    await expect(BoxSelector).toBeVisible();
    await BoxSelector.click({ timeout: TIMEOUTS.DEFAULT });

    // click a box to the idea
    await page.getByRole('option', { name: idea.box }).first().click({ timeout: TIMEOUTS.DEFAULT });
  }

  if (idea.category) {
    // how to fill in one of those MUI multiselectors:
    const CategorySelector = page.getByTestId('category-field-text-input');
    await expect(CategorySelector).toBeVisible();
    await CategorySelector.click({ timeout: TIMEOUTS.DEFAULT });

    // click a category to the idea
    await page.getByRole('option', { name: idea.category }).first().click({ timeout: TIMEOUTS.DEFAULT });
  }

  // submit the idea form
  await formInteractions.clickButton(page, 'submit-idea-form');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="add-idea-form"]', { state: 'hidden', timeout: TIMEOUTS.DEFAULT });

  const IdeaTitle = page.getByText(idea.name, { exact: true });
  await expect(IdeaTitle).toBeVisible();
};

export const remove = async (
  page: Page, //
  room: types.RoomData,
  idea: types.IdeaData
) => {
  await navigation.goToRoom(page, room.name);

  const IdeaDiv = page.getByTestId(`idea-${idea.name}`);
  await expect(IdeaDiv).toBeVisible();

  // so that any triggered tooltips dissappear
  await page.mouse.move(0, 0);

  await formInteractions.openMoreOption(page, IdeaDiv);
  await IdeaDiv.getByTestId('delete-button').click({ timeout: TIMEOUTS.DEFAULT });
  await formInteractions.clickButton(page, `confirm-button`);

  await expect(IdeaDiv).toHaveCount(0);
};

export const comment = async (page: Page, commentText: string) => {
  formInteractions.clickButton(page, 'add-comment-button');
  await page.waitForSelector('[data-testid="comment-form"]', { state: 'visible', timeout: TIMEOUTS.DEFAULT });

  await page.getByTestId('comment-form').locator('div[contenteditable="true"]').fill(commentText);

  // submit the comment form
  formInteractions.clickButton(page, 'confirm-comment-button');

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible({ timeout: TIMEOUTS.LONG });
  const commentCount = await Comment.count();
  expect(commentCount).toBeGreaterThan(0);
};

export const removeComment = async (
  page: Page, //
  commentText: string
) => {
  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();

  await formInteractions.clickButton(page, `comment-more-options`);
  await formInteractions.clickButton(page, `delete-button`);
  await formInteractions.clickButton(page, `confirm-button`);

  await expect(Comment).toHaveCount(0);
};
