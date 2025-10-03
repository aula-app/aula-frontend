import { expect, Locator, Page } from '@playwright/test';
import * as shared from '../shared';
import * as types from '../../fixtures/types';
import * as formsInteractions from './forms';
import * as settingsInteractions from './settings';
import * as navigation from './navigation';
import * as browsers from './browsers';

const host = shared.getHost();

type TempPass = string;

export const exists = async (page: Page, data: types.UserData): Promise<Locator> => {
  await navigation.goToUsersSettings(page);
  return await settingsInteractions.checkRow(page, { option: 'username', value: data.username });
};

export const create = async (page: Page, data: types.UserData): Promise<TempPass> => {
  console.log('🔧 Starting user creation for:', data.username);

  try {
    await navigation.goToUsersSettings(page);

    await formsInteractions.clickButton(page, 'add-users-button');
    await page.waitForTimeout(1000);

    await page.fill('input[name="displayname"]', data.displayName);
    await page.fill('input[name="username"]', data.username);
    await page.fill('input[name="realname"]', data.realName);

    await page.getByTestId('rolefield').click({ timeout: 1000 });
    await page.locator(`li[data-value="${data.role}"]`).click({ timeout: 1000 });
    await page.locator('div[contenteditable="true"]').fill(data.about);

    await formsInteractions.clickButton(page, 'submit-user-form');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

    await exists(page, data);

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
  await page.waitForLoadState('networkidle');

  const row = await exists(page, data);
  const viewPassButton = row.locator('button');
  await viewPassButton.click({ timeout: 1000 });

  // temporary password must exist and be pulled out of the page.
  const pass: string = (await row.locator('div[role="button"] span').textContent())!;
  expect(pass).toBeTruthy();

  await settingsInteractions.clearFilter(page);

  return pass;
};

export const remove = async (page: Page, data: types.UserData) => {
  try {
    const row = await exists(page, data);
    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: 5000 });
    await checkbox.check();

    await formsInteractions.clickButton(page, 'remove-users-button');
    await page.waitForTimeout(500);
    await formsInteractions.clickButton(page, 'confirm-delete-users-button');
    await page.waitForTimeout(500);

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0, { timeout: 10000 });

    await settingsInteractions.clearFilter(page);

    console.log('✅ Successfully removed user:', data.username);
  } catch (error) {
    console.warn(`Failed to remove user ${data.username}:`, error);
    throw error;
  }
};

export const loginAttempt = async (page: Page, data: types.UserData) => {
  await page.goto(host);
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('input[name="username"]', { timeout: 10000 });
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.locator('button[type="submit"]').click({ timeout: 1000 });
  await page.waitForLoadState('networkidle');
};

// Helper function to log in a user
export const login = async (page: Page, data: types.UserData) => {
  await loginAttempt(page, data);
  await page.waitForTimeout(1000);
  await expect(page.locator('#rooms-heading')).toBeVisible();
};

// Helper function to log out a user
export const logout = async (page: Page) => {
  await navigation.goToHome(page);
  await formsInteractions.clickButton(page, 'logout-button');
  await page.waitForLoadState('networkidle');
};

export const register = async (page: Page, data: types.UserData, tempPass: string) => {
  console.log('🔧 Starting registration flow for:', data.username);
  try {
    await navigation.goToHome(page);

    await page.fill('input[name="username"]', data.username);
    await page.fill('input[name="password"]', tempPass);
    await page.locator('button[type="submit"]').click({ timeout: 1000 });

    const oldPasswordButton = page.locator('input[name="oldPassword"]');
    await expect(oldPasswordButton).toBeVisible();

    await page.fill('input[name="oldPassword"]', tempPass);
    await page.fill('input[name="newPassword"]', data.password);
    await page.fill('input[name="confirmPassword"]', data.password);
    await page.locator('button[type="submit"]').click({ timeout: 1000 });

    await login(page, data);
    console.log('✅ Successfully registered user:', data.username);
  } catch (error) {
    console.error('❌ Failed to register user:', data.username, error);
    throw error;
  }
};

export const start = async (page: Page, data: types.UserData) => {
  try {
    const tempPassword = await create(page, data);
    const newBrowser = await browsers.create(data.username);
    await register(newBrowser, data, tempPassword);
  } catch (error) {
    console.error(`❌ Error generating user: ${data.username}. `, error);
    throw error;
  }
};
