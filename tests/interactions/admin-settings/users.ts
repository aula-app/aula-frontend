import { expect, Locator, Page } from '@playwright/test';
import * as types from '../../support/types';
import * as formsInteractions from './../forms';
import * as settingsInteractions from './../settings';
import * as navigation from './../navigation';

export const existsByUsername = async (page: Page, data: types.UserData): Promise<Locator> => {
  await navigation.goToUsersSettings(page);
  return await settingsInteractions.check(page, { option: 'username', value: data.username });
};

export const create = async (page: Page, data: types.UserData): Promise<string> => {
  console.log('🔧 Starting user creation for:', data.username);

  try {
    await navigation.goToUsersSettings(page);

    await formsInteractions.clickButton(page, 'add-users-button');
    await expect(page.getByTestId('displayname-input')).toBeVisible();

    await formsInteractions.fillForm(page, 'displayname', data.displayName);
    await formsInteractions.fillForm(page, 'username', data.username);
    await formsInteractions.fillForm(page, 'realname', data.realName);
    await formsInteractions.fillMarkdownForm(page, 'about_me', data.about);

    await formsInteractions.selectOptionByValue(page, 'select-field-userlevel', `${data.role}`);

    await formsInteractions.clickButton(page, 'submit-user-form');
    await existsByUsername(page, data);

    const pass = await getTemporaryPass(page, data);
    console.log('✅ Successfully created user:', data.username);
    return pass;
  } catch (error) {
    console.error('❌ Failed to create user:', data.username, error);
    throw error;
  }
};

export const getTemporaryPass = async (page: Page, data: types.UserData) => {
  // navigate to the users settings page:
  await navigation.goToUsersSettings(page);
  const row = await existsByUsername(page, data);
  const viewPassButton = row.locator('button');
  await viewPassButton.click();

  // temporary password must exist and be pulled out of the page.
  const passLocator = row.locator('div[role="button"] span').filter({ hasText: /^.{8}$/ });
  await expect(passLocator).toBeVisible();
  const pass: string = (await passLocator.textContent())!;
  expect(pass).toBeTruthy();

  await settingsInteractions.clearFilter(page);

  return pass;
};

export const remove = async (page: Page, data: types.UserData) => {
  try {
    await navigation.goToUsersSettings(page);

    const row = await existsByUsername(page, data);
    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();

    // Ensure checkbox is unchecked first, then check it
    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
    }
    await checkbox.check();

    await formsInteractions.clickButton(page, 'remove-users-button');
    await formsInteractions.clickButton(page, 'confirm-delete-users-button');

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0);

    await settingsInteractions.clearFilter(page);

    console.log('✅ Successfully removed user:', data.username);
  } catch (error) {
    console.warn(`Failed to remove user ${data.username}:`, error);
    throw error;
  }
};
