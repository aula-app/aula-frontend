import { expect, Page } from '@playwright/test';
import { TEST_IDS } from '../../src/test-ids';

import * as types from '../support/types';
import * as formInteractions from './forms';
import * as navigation from './navigation';

export const create = async (
  page: Page, //
  idea: types.IdeaData
) => {
  // start at home
  await formInteractions.clickButton(page, 'add-idea-button');
  await expect(page.getByTestId('add-idea-form')).toBeVisible();

  // fill in the necessary information
  await formInteractions.fillForm(page, 'idea-title', idea.name);
  await formInteractions.fillMarkdownForm(page, 'content', idea.description);

  if (idea.box) {
    // how to fill in one of those MUI multiselectors:
    const BoxSelector = page.getByTestId('box-field-select-input');
    await expect(BoxSelector).toBeVisible();
    await BoxSelector.click();

    // click a box to the idea
    await page.getByRole('option', { name: idea.box }).first().click();
  }

  if (idea.category) {
    // how to fill in one of those MUI multiselectors:
    const CategorySelector = page.getByTestId('category-field-text-input');
    await expect(CategorySelector).toBeVisible();
    await CategorySelector.click();

    // click a category to the idea
    await page.getByRole('option', { name: idea.category }).first().click();
  }

  // submit the idea form
  await formInteractions.clickButton(page, 'submit-idea-form');
  await expect(page.getByTestId('add-idea-form')).toBeHidden({ timeout: 5000 });

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
  await IdeaDiv.getByTestId(TEST_IDS.DELETE_BUTTON).click();
  await formInteractions.clickButton(page, TEST_IDS.CONFIRM_BUTTON);

  await expect(IdeaDiv).toHaveCount(0);
};

export const comment = async (page: Page, commentText: string) => {
  await formInteractions.clickButton(page, 'add-comment-button');
  await expect(page.getByTestId('comment-form')).toBeVisible();

  await page.getByTestId('comment-form').locator('div[contenteditable="true"]').fill(commentText);

  // submit the comment form
  await formInteractions.clickButton(page, 'confirm-comment-button');

  const Comment = page.getByTestId('comment-bubble').filter({ hasText: commentText });
  await expect(Comment).toBeVisible();
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
  await formInteractions.clickButton(page, TEST_IDS.DELETE_BUTTON);
  await formInteractions.clickButton(page, TEST_IDS.CONFIRM_BUTTON);

  await expect(Comment).toHaveCount(0);
};
