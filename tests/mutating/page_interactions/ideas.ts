import { expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import * as shared from '../../shared';
import { sleep } from '../../utils';
import * as roomFixtures from '../../fixtures/rooms';
import * as ideaFixtures from '../../fixtures/ideas';

const host = shared.getHost();

const runId = shared.getRunId();

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
  await expect(AddIdeaButton).toBeVisible();
  await AddIdeaButton.click();

  // fill in the necessary information
  await page.fill('input[name="title"]', idea.name);
  await page.locator('div[contenteditable="true"]').fill(idea.description);

  // submit the idea form
  await page.locator('button[type="submit"]').click();

  const IdeaTitle = page.locator('h3').filter({ hasText: idea.name });
  await expect(IdeaTitle).toBeVisible();
};
