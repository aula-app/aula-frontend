import { expect, Page } from '@playwright/test';

import * as types from "../support/types";
import * as formInteractions from './forms';
import * as navigation from './navigation';
import * as settingsInteractions from './settings';

export const create = async (page: Page, box: types.BoxData) => {
  await navigation.goToBoxesSettings(page);

  await page.waitForSelector('[data-testid="add-boxes-button"]', { state: 'visible', timeout: 500 });
  await formInteractions.clickButton(page, 'add-boxes-button');
  await page.waitForTimeout(500);

  await sendForm(page, box);

  await navigation.goToBoxesSettings(page);
  await expect(page.getByTestId('add-boxes-button')).toBeVisible();
  await settingsInteractions.check(page, { option: 'name', value: box.name });
};

export const edit = async (page: Page, box: types.BoxData) => {
  await navigation.goToBoxesSettings(page);
  await settingsInteractions.openEdit({ page, filters: { option: 'name', value: box.name } });
  await sendForm(page, box);
};

export const fill = async (page: Page, box: types.BoxData) => {
  await sendForm(page, box);
};

export const remove = async (page: Page, box: types.BoxData) => {
  await navigation.goToBoxesSettings(page);

  await settingsInteractions.remove({ page, scope: 'boxes', filters: { option: 'name', value: box.name } });
};

const sendForm = async (page: Page, box: types.BoxData) => {
  await page.waitForSelector('[data-testid="box-name-input"]', { state: 'visible', timeout: 500 });

  await formInteractions.fillForm(page, 'box-name', box.name);
  await formInteractions.fillMarkdownForm(page, 'description_public', box.description);

  await formInteractions.selectOption(page, 'select-field-room_hash_id', box.room.name);

  if (box.phase) {
    await formInteractions.selectOptionByValue(page, 'select-field-phase_id', String(box.phase));
  }

  if (box.discussionDays) {
    await formInteractions.fillForm(page, 'phase_duration_1', String(box.discussionDays));
  }

  if (box.votingDays) {
    await formInteractions.fillForm(page, 'phase_duration_3', String(box.votingDays));
  }

  for (const i of box.ideas || []) {
    await formInteractions.selectOption(page, 'ideas-autocomplete-field', i.name);
  }

  await formInteractions.clickButton(page, 'box-form-submit-button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
};
