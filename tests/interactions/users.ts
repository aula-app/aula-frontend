import { expect, Locator, Page } from '@playwright/test';
import * as shared from '../support/utils';
import * as types from '../support/types';
import * as formsInteractions from './forms';
import * as settingsInteractions from './settings';
import * as navigation from './navigation';
const host = shared.getHost();

type TempPass = string;

export const existsByUsername = async (page: Page, data: types.UserData): Promise<Locator> => {
  await navigation.goToUsersSettings(page);
  return await settingsInteractions.check(page, { option: 'username', value: data.username });
};

export const create = async (page: Page, data: types.UserData): Promise<TempPass> => {
  console.log('🔧 Starting user creation for:', data.username);

  try {
    await navigation.goToUsersSettings(page);

    await formsInteractions.clickButton(page, 'add-users-button');
    await page.waitForTimeout(1000);

    await formsInteractions.fillForm(page, 'displayname', data.displayName);
    await formsInteractions.fillForm(page, 'username', data.username);
    await formsInteractions.fillForm(page, 'realname', data.realName);
    await formsInteractions.fillMarkdownForm(page, 'about_me', data.about);

    await formsInteractions.selectOptionByValue(page, 'select-field-userlevel', `${data.role}`);

    await formsInteractions.clickButton(page, 'submit-user-form');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

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
  await page.waitForLoadState('networkidle');

  const row = await existsByUsername(page, data);
  const viewPassButton = row.locator('button');
  await viewPassButton.click({ timeout: 1000 });

  // temporary password must exist and be pulled out of the page.
  const passLocator = row.locator('div[role="button"] span');
  await passLocator.waitFor({ state: 'visible', timeout: 5000 });
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
    await expect(checkbox).toBeVisible({ timeout: 2000 });

    // Ensure checkbox is unchecked first, then check it
    if (await checkbox.isChecked()) {
      await checkbox.uncheck({ timeout: 300 });
    }
    await checkbox.check({ timeout: 300 });

    await formsInteractions.clickButton(page, 'remove-users-button');
    await formsInteractions.clickButton(page, 'confirm-delete-users-button');

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0, { timeout: 5000 });

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
  await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: 1000 });
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

    // Wait for navigation and check if we're logged in
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if we're on the home page (logged in) or need to login again
    const isLoggedIn = await page.locator('#rooms-heading').isVisible();

    if (!isLoggedIn) {
      console.log('⚠️ User not automatically logged in after password change, attempting manual login');
      // If not automatically logged in, do a manual login
      await page.goto(host);
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="username"]', data.username);
      await page.fill('input[name="password"]', data.password);
      await page.locator('button[type="submit"]').click({ timeout: 1000 });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: 5000 });
    }

    console.log('✅ Successfully registered user:', data.username);
  } catch (error) {
    console.error('❌ Failed to register user:', data.username, error);
    console.error('Current URL:', page.url());
    console.error('Page title:', await page.title());
    throw error;
  }
};

export const firstLoginFlow = async (page: Page, data: types.UserData, tempPass: string) => {
  await page.goto(host);

  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', tempPass);
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  const oldPasswordButton = page.locator('input[name="oldPassword"]');
  await expect(oldPasswordButton).toBeVisible();

  await page.fill('input[name="oldPassword"]', tempPass);
  await page.fill('input[name="newPassword"]', data.password);
  await page.fill('input[name="confirmPassword"]', data.password);
  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  // Wait for navigation after password change
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Check if we're logged in, if not, perform login
    const isLoggedIn = await page.locator('#rooms-heading').isVisible().catch(() => false);
    if (!isLoggedIn) {
      await login(page, data);
    }
  } catch (error) {
    // If page was closed/redirected, perform fresh login
    if (!page.isClosed()) {
      await login(page, data);
    }
  }
};
