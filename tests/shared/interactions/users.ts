import { expect, Page } from '@playwright/test';
import * as shared from '../shared';
import * as types from '../../fixtures/types';
import * as formsInteractions from './forms';
import * as navigation from './navigation';

const host = shared.getHost();

type TempPass = string;

export const exists = async (page: Page, data: types.UserData) => {
  await navigation.goToUsersSettings(page);

  // Check if filter menu is already open, if not, open it
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();

  // Check if filter menu is already open by looking for the clear button
  const existsClearButton = page.getByTestId('clear-filter-button');
  const isFilterMenuOpen = await existsClearButton.isVisible();

  if (!isFilterMenuOpen) {
    await FilterButton.click({ timeout: 1000 });
  }

  // select "username" from the "filter by" dropdown
  await page.locator('#filter-field-select').click({ timeout: 1000 });
  await page.locator('li[data-value="username"]').click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-value-input', data.username);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: data.username });

  // make sure that row actually exists
  await expect(row).toHaveCount(1);
};

export const getTemporaryPass = async (page: Page, data: types.UserData) => {
  // navigate to the users settings page:
  await navigation.goToUsersSettings(page);

  // Check if filter menu is already open, if not, open it
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();

  // Check if filter menu is already open by looking for the clear button
  const filterClearButton = page.getByTestId('clear-filter-button');
  const isFilterMenuOpen = await filterClearButton.isVisible();

  if (!isFilterMenuOpen) {
    await FilterButton.click({ timeout: 1000 });
  }

  const filterInput = page.locator('#filter-value-input');
  await expect(FilterButton).toBeVisible();

  // select "username" from the "filter by" dropdown
  await page.locator('#filter-field-select').click({ timeout: 1000 });
  await page.locator('li[data-value="username"]').click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-value-input', data.username);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: data.username });

  // make sure that row actually exists
  await expect(row).toHaveCount(1);

  // get the temporary password for the user to return and use later
  const viewPassButton = row.locator('button');
  await viewPassButton.click({ timeout: 1000 });

  const pass: string = (await row.locator('div[role="button"] span').textContent())!;

  // temporary password must exist and be pulled out of the page.
  expect(pass).toBeTruthy();

  // Clear the search and close filters
  const clearButton = page.getByTestId('clear-filter-button');
  await clearButton.click({ timeout: 1000 });

  // Check if the search field is clean
  await expect(filterInput).toHaveValue('', { timeout: 5000 });

  // Close the filter menu
  await FilterButton.click({ timeout: 1000 });
  await expect(clearButton).not.toBeVisible({ timeout: 5000 });

  return pass;
};

export const create = async (page: Page, data: types.UserData): Promise<TempPass> => {
  console.log('🔧 Starting user creation for:', data.username);

  try {
    await navigation.goToUsersSettings(page);
    await page.waitForLoadState('networkidle');

    const addUsersButton = page.getByTestId('add-users-button');
    await expect(addUsersButton).toBeVisible({ timeout: 10000 });
    await addUsersButton.click({ timeout: 5000 });

    await page.fill('input[name="displayname"]', data.displayName);
    await page.fill('input[name="username"]', data.username);
    await page.fill('input[name="realname"]', data.realName);

    await page.getByTestId('rolefield').click({ timeout: 1000 });

    await page.locator(`li[data-value="${data.role}"]`).click({ timeout: 1000 });

    await page.locator('div[contenteditable="true"]').fill(data.about);

    await page.getByTestId('submit-user-form').click({ timeout: 1000 });

    const pass = await getTemporaryPass(page, data);
    console.log('✅ Successfully created user:', data.username);
    return pass;
  } catch (error) {
    console.error('❌ Failed to create user:', data.username, error);
    throw error;
  }
};

export const remove = async (page: Page, data: types.UserData) => {
  await navigation.goToUsersSettings(page);

  try {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check if filter menu is already open, if not, open it
    const FilterButton = page.locator('#filter-toggle-button');
    await expect(FilterButton).toBeVisible({ timeout: 10000 });

    // Check if filter menu is already open by looking for the clear button
    const filterClearButton = page.getByTestId('clear-filter-button');
    const isFilterMenuOpen = await filterClearButton.isVisible();

    if (!isFilterMenuOpen) {
      console.log('🔧 Opening filter menu');
      await FilterButton.click({ timeout: 1000 });
      // Wait for filter menu to be fully open
      await page.waitForTimeout(500);
    } else {
      console.log('🔧 Filter menu already open');
    }

    // select "username" from the "filter by" dropdown
    const filterFieldSelect = page.locator('#filter-field-select');
    await expect(filterFieldSelect).toBeVisible({ timeout: 5000 });
    await filterFieldSelect.click({ timeout: 1000 });

    const usernameOption = page.locator('li[data-value="username"]');
    await expect(usernameOption).toBeVisible({ timeout: 5000 });
    await usernameOption.click({ timeout: 1000 });

    // Wait for the filter input to become visible and enabled
    const filterInput = page.locator('#filter-value-input');
    await expect(filterInput).toBeVisible({ timeout: 10000 });
    await expect(filterInput).toBeEnabled({ timeout: 5000 });

    // Clear any existing value and fill with username
    await filterInput.clear();
    await filterInput.fill(data.username);

    // Wait for filtering to complete
    await page.waitForTimeout(1000);

    // find the user's row in the table and select the checkbox for actions
    const row = page.locator('table tr').filter({ hasText: data.username });
    await expect(row).toBeVisible({ timeout: 10000 });

    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: 5000 });
    await checkbox.check();

    // click the remove user button
    const ButtonRemoveUser = page.getByTestId('remove-users-button');
    await expect(ButtonRemoveUser).toBeVisible({ timeout: 5000 });
    await ButtonRemoveUser.click({ timeout: 1000 });

    // confirm deletion
    const ButtonConfirmDelete = page.getByTestId('confirm-delete-users-button');
    await expect(ButtonConfirmDelete).toBeVisible({ timeout: 5000 });
    await ButtonConfirmDelete.click({ timeout: 1000 });

    // Wait for deletion to complete
    await page.waitForTimeout(2000);

    // confirm the user does not show up in the table list
    await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0, { timeout: 10000 });

    // Clear the search and close filters to clean up for next operation
    try {
      const clearButton = page.getByTestId('clear-filter-button');
      if (await clearButton.isVisible()) {
        await clearButton.click({ timeout: 1000 });
        console.log('🔧 Cleared filter after user removal');

        // Close the filter menu
        await FilterButton.click({ timeout: 1000 });
        await expect(clearButton).not.toBeVisible({ timeout: 5000 });
        console.log('🔧 Closed filter menu after user removal');
      }
    } catch (cleanupError) {
      console.warn('Could not clean up filter menu:', cleanupError);
    }
  } catch (error) {
    console.warn(`Failed to remove user ${data.username}:`, error);

    // Try alternative removal method - check if user exists at all
    try {
      const userExists = await page.locator('table tr').filter({ hasText: data.username }).count();
      if (userExists === 0) {
        console.log(`User ${data.username} already removed or doesn't exist`);
        return;
      }
    } catch (checkError) {
      console.warn(`Could not verify user existence for ${data.username}:`, checkError);
    }

    // Re-throw the original error if user still exists
    throw error;
  }
};

export const loginAttempt = async (page: Page, data: types.UserData) => {
  await page.goto(host);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.locator('button[type="submit"]').click({ timeout: 1000 });
};

// Helper function to log in a user
export const login = async (page: Page, data: types.UserData) => {
  await loginAttempt(page, data);
  await expect(page.locator('#rooms-heading')).toBeVisible();
};

// Helper function to log out a user
export const logout = async (page: Page) => {
  await navigation.goToHome(page);
  await formsInteractions.clickButton(page, 'logout-button');
  await page.waitForLoadState('networkidle');
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

  await login(page, data);
};
