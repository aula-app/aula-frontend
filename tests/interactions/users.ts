import { expect, Locator, Page } from '@playwright/test';
import * as shared from '../support/utils';
import * as types from '../support/types';
import * as formsInteractions from './forms';
import * as settingsInteractions from './settings';
import * as navigation from './navigation';
import { TIMEOUTS } from '../support/timeouts';
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
    await page.waitForSelector('[data-testid="displayname-input"]', { state: 'visible', timeout: TIMEOUTS.LONG });

    await formsInteractions.fillForm(page, 'displayname', data.displayName);
    await formsInteractions.fillForm(page, 'username', data.username);
    await formsInteractions.fillForm(page, 'realname', data.realName);
    await formsInteractions.fillMarkdownForm(page, 'about_me', data.about);

    await formsInteractions.selectOptionByValue(page, 'select-field-userlevel', `${data.role}`);

    await formsInteractions.clickButton(page, 'submit-user-form');
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
  await viewPassButton.click({ timeout: TIMEOUTS.DEFAULT });

  // temporary password must exist and be pulled out of the page.
  const passLocator = row.locator('div[role="button"] span');
  await passLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
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
    await expect(checkbox).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Ensure checkbox is unchecked first, then check it
    if (await checkbox.isChecked()) {
      await checkbox.uncheck({ timeout: TIMEOUTS.SHORT });
    }
    await checkbox.check({ timeout: TIMEOUTS.SHORT });

    await formsInteractions.clickButton(page, 'remove-users-button');
    await formsInteractions.clickButton(page, 'confirm-delete-users-button');

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0, { timeout: TIMEOUTS.LONG });

    await settingsInteractions.clearFilter(page);

    console.log('✅ Successfully removed user:', data.username);
  } catch (error) {
    console.warn(`Failed to remove user ${data.username}:`, error);
    throw error;
  }
};

export const ensureInstanceEntered = async (page: Page, username?: string) => {
  const instanceCodeAlreadySet = await page.getByTestId('current-instance-code').isVisible();
  if (instanceCodeAlreadySet) {
    return true;
  }

  const instance = process.env.INSTANCE_CODE || 'SINGLE';
  const instanceCodeInputDiv = page.getByTestId('input-instance-code');
  if ((await instanceCodeInputDiv.count()) === 0) {
    console.log(`${instance === 'SINGLE' ? '✅' : '⚠️'} No instance selector input found. User: "${username}"`);
    if (instance !== 'SINGLE') {
      throw new Error('Instance selector input not found on the page, but we are testing a multi-instance FE.');
    }

    // if there's no instance code input, then we must be on single-instance FE, right? 😏
    return true;
  } else {
    console.log(`ℹ️ Testing multi instance FE, attempting to use "${instance}"... User: "${username}"`);
    await instanceCodeInputDiv.locator(page.locator('input[name="instance-code"]')).fill(instance);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { timeout: TIMEOUTS.DEFAULT, waitUntil: 'networkidle' });
    return true;
  }
};

export const loginAttempt = async (page: Page, data: types.UserData) => {
  await page.goto(host, { waitUntil: 'networkidle' });
  await ensureInstanceEntered(page, data.username);
  await page.waitForSelector('input[name="username"]', { timeout: TIMEOUTS.STANDARD });
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });
  await page.waitForLoadState('networkidle');
};

// Helper function to log in a user
export const login = async (page: Page, data: types.UserData) => {
  await loginAttempt(page, data);
  await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
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
    await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });

    const oldPasswordButton = page.locator('input[name="oldPassword"]');
    await expect(oldPasswordButton).toBeVisible();

    await page.fill('input[name="oldPassword"]', tempPass);
    await page.fill('input[name="newPassword"]', data.password);
    await page.fill('input[name="confirmPassword"]', data.password);
    await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });

    // Wait for navigation and check if we're logged in
    await page.waitForLoadState('networkidle');

    // Check if we're on the home page (logged in) or need to login again
    const isLoggedIn = await page.locator('#rooms-heading').isVisible();

    if (!isLoggedIn) {
      console.log('⚠️ User not automatically logged in after password change, attempting manual login');
      // If not automatically logged in, do a manual login
      await page.goto(host);
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="username"]', data.username);
      await page.fill('input[name="password"]', data.password);
      await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: TIMEOUTS.LONG });
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
  await page.goto(host, { waitUntil: 'networkidle' });
  await ensureInstanceEntered(page, data.username);

  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', tempPass);
  await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });

  const oldPasswordInput = page.locator('input[name="oldPassword"]');
  await expect(oldPasswordInput).toBeVisible();
  await oldPasswordInput.fill(tempPass);

  await page.fill('input[name="newPassword"]', data.password);
  await page.fill('input[name="confirmPassword"]', data.password);
  await page.locator('button[type="submit"]').click({ timeout: TIMEOUTS.DEFAULT });

  await login(page, data);
};
