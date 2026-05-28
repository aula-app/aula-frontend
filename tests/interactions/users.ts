import { expect, Page } from '@playwright/test';
import * as shared from '../support/utils';
import * as types from '../support/types';
import * as formsInteractions from './forms';
import * as navigation from './navigation';
import { TIMEOUTS } from '../support/constants';

const host = shared.getHost();

export const ensureSpecificInstanceEntered = async (page: Page, instanceCode: string) => {
  const instanceCodeAlreadySet = await page.getByTestId('current-instance-code').isVisible();
  if (instanceCodeAlreadySet && (await page.getByTestId('current-instance-code').innerText()) === instanceCode) {
    return true;
  }

  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if ((await instanceCodeInput.count()) === 0) {
    console.log(`No instance selector input found.`);
    throw new Error('Instance selector input not found on the page, but we are testing a multi-instance FE.');
  } else {
<<<<<<< HEAD
    console.log(`ℹ️ Testing multi instance FE, attempting to use "${instanceCode}"...`);
    await instanceCodeInput.fill(instanceCode);
=======
    await instanceCodeInputDiv.locator(page.locator('input[name="instance-code"]')).fill(instanceCode);
>>>>>>> main
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
    return true;
  }
};

export const ensureInstanceEntered = async (page: Page, username?: string) => {
  const instanceCodeAlreadySet = await page.getByTestId('current-instance-code').isVisible();
  if (instanceCodeAlreadySet) {
    return true;
  }

  const instance = process.env.INSTANCE_CODE || 'SINGLE';
  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if ((await instanceCodeInput.count()) === 0) {
    console.log(`${instance === 'SINGLE' ? '✅' : '⚠️'} No instance selector input found. User: "${username}"`);
    if (instance !== 'SINGLE') {
      throw new Error('Instance selector input not found on the page, but we are testing a multi-instance FE.');
    }

    // if there's no instance code input, then we must be on single-instance FE, right? 😏
    return true;
  } else {
    console.log(`ℹ️ Testing multi instance FE, attempting to use "${instance}"... User: "${username}"`);
    await instanceCodeInput.fill(instance);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
    return true;
  }
};

export const loginAttempt = async (page: Page, data: { username: string; password: string }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceEntered(page, data.username);
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.getByTestId('submit-login').click();
  await page.waitForLoadState('domcontentloaded');
};

// Helper function to log in a user
export const login = async (page: Page, data: { username: string; password: string }) => {
  await loginAttempt(page, data);
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('error-alert')).not.toBeVisible({ timeout: TIMEOUTS.ONE_SECOND });
  await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: TIMEOUTS.FIVE_SECONDS });
};

// Helper function to log out a user
export const logout = async (page: Page) => {
  await navigation.goToHome(page);
  await formsInteractions.clickButton(page, 'logout-button');
  await expect(page.locator('input[name="username"]')).toBeVisible();
};

export const register = async (page: Page, data: types.UserData, tempPass: string) => {
  console.log('🔧 Starting registration flow for:', data.username);
  try {
    await navigation.goToHome(page);

    await page.fill('input[name="username"]', data.username);
    await page.fill('input[name="password"]', tempPass);
    await page.getByTestId('submit-login').click();

    await expect(page.getByTestId('oldPassword-input')).toBeVisible();
    await page.fill('input[name="oldPassword"]', tempPass);
    await page.fill('input[name="newPassword"]', data.password);
    await page.fill('input[name="confirmPassword"]', data.password);
    await page.getByTestId('submit-set-password').click();

    // Check if we're on the home page (logged in) or need to login again
    const isLoggedIn = await page.locator('#rooms-heading').isVisible();

    if (!isLoggedIn) {
      console.log('⚠️ User not automatically logged in after password change, attempting manual login');
      // If not automatically logged in, do a manual login
      await page.goto(host, { waitUntil: 'domcontentloaded' });
      await page.fill('input[name="username"]', data.username);
      await page.fill('input[name="password"]', data.password);
      await page.getByTestId('submit-login').click();
      await expect(page.locator('#rooms-heading')).toBeVisible();
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
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', tempPass);
  await page.getByTestId('submit-login').click();

  await expect(page.getByTestId('oldPassword-input')).toBeVisible();
  await page.fill('input[name="oldPassword"]', tempPass);
  await page.fill('input[name="newPassword"]', data.password);
  await page.fill('input[name="confirmPassword"]', data.password);
  await page.getByTestId('submit-set-password').click();
  await login(page, data);
};
