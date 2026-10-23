import { expect, Page } from '@playwright/test';
import * as types from '../support/types';
import * as formsInteractions from './forms';
import * as settingsInteractions from './settings';
import * as navigation from './navigation';
import { TIMEOUTS } from '../support/constants';

export const create = async (page: Page, data: types.MessageData) => {
  try {
    await navigation.goToMessagesSettings(page);

    await formsInteractions.clickButton(page, 'add-messages-button');

    await formsInteractions.selectMultiAutocompleteOption(page, 'user-field-autocomplete-input', data.user.username);

    await formsInteractions.fillForm(page, 'message-headline', data.title);
    await formsInteractions.fillMarkdownForm(page, 'body', data.content);

    await formsInteractions.clickButton(page, 'submit-message-form');

    const row = page.locator('table tr').filter({ hasText: data.title });
    await expect(row).toBeVisible();

    console.log('✅ Successfully created message for:', data.user.username);
  } catch (error) {
    console.error('❌ Failed to create message for:', data.user.username, error);
    throw error;
  }
};

/**
 * The inbox card for a message, found by its headline
 * @param page - Recipient's page, on /messages
 * @param headline - Message headline
 */
export const card = (page: Page, headline: string) =>
  page.getByTestId('message-item').filter({ has: page.getByRole('heading', { name: headline, exact: true }) });

/**
 * Open a message from the inbox and wait for its detail
 * @param page - Recipient's page
 * @param headline - Message headline
 */
export const open = async (page: Page, headline: string) => {
  await navigation.goToMessages(page);
  await card(page, headline).getByRole('link').click();
  await page.waitForURL((url) => /^\/messages\/.+/.test(url.pathname));
  await expect(page.locator('[data-testid^="message-detail-"]')).toContainText(headline);
};

export const remove = async (page: Page, data: types.MessageData) => {
  try {
    await navigation.goToMessagesSettings(page);

    await settingsInteractions.filter(page, { option: 'headline', value: data.title });
    await settingsInteractions.check(page, { option: 'headline', value: data.title });

    const row = page.locator('table tr').filter({ hasText: data.title }).first();
    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
    await checkbox.check();

    await formsInteractions.clickButton(page, 'remove-messages-button');
    await formsInteractions.clickButton(page, 'confirm-delete-messages-button');

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.title })).toHaveCount(0, {
      timeout: TIMEOUTS.THREE_SECONDS,
    });

    await settingsInteractions.clearFilter(page);

    console.log('✅ Successfully removed message for:', data.user.username);
  } catch (error) {
    console.error('❌ Failed to remove message for:', data.user.username, error);
    throw error;
  }
};
