import { expect, Page } from '@playwright/test';
import * as types from "../support/types";
import * as formsInteractions from './forms';
import * as settingsInteractions from './settings';
import * as navigation from './navigation';

export const create = async (page: Page, data: types.MessageData) => {
  try {
    await navigation.goToMessagesSettings(page);

    await formsInteractions.clickButton(page, 'add-messages-button');

    await formsInteractions.selectAutocompleteOption(page, 'user-field-autocomplete', data.user.realName);

    await formsInteractions.fillForm(page, 'message-headline', data.title);
    await formsInteractions.fillMarkdownForm(page, 'body', data.content);

    await formsInteractions.clickButton(page, 'submit-message-form');
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('submit-message-form')).not.toBeVisible();

    const row = page.locator('table tr').filter({ hasText: data.title });
    await expect(row).toBeVisible();

    console.log('✅ Successfully created message for:', data.user.username);
  } catch (error) {
    console.error('❌ Failed to create message for:', data.user.username, error);
    throw error;
  }
};

export const remove = async (page: Page, data: types.MessageData) => {
  try {
    await navigation.goToMessagesSettings(page);

    await settingsInteractions.filter(page, { option: 'headline', value: data.title });
    await settingsInteractions.check(page, { option: 'headline', value: data.title });

    const row = page.locator('table tr').filter({ hasText: data.title }).first();
    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: 5000 });
    await checkbox.check();

    await formsInteractions.clickButton(page, 'remove-messages-button');
    await page.waitForTimeout(500);
    await formsInteractions.clickButton(page, 'confirm-delete-messages-button');
    await page.waitForTimeout(500);

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.title })).toHaveCount(0, { timeout: 10000 });

    await settingsInteractions.clearFilter(page);

    console.log('✅ Successfully removed message for:', data.user.username);
  } catch (error) {
    console.error('❌ Failed to remove message for:', data.user.username, error);
    throw error;
  }
};
