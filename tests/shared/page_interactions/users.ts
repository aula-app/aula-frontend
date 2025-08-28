import { expect, Page } from '@playwright/test';
import * as shared from '../shared';
import * as users from '../../fixtures/users';

const host = shared.getHost();

type TempPass = string;

export const goToProfile = async (page: Page) => {
  await page.goto(host);

  const ProfileButton = page.locator('a[href="/settings/profile"]');
  await expect(ProfileButton).toBeVisible();
  await ProfileButton.click({ timeout: 1000 });
};

export const goToSettings = async (page: Page) => {
  await page.goto(host);

  const SettingsButton = page.locator('a[href="/settings/configuration"]');
  await expect(SettingsButton).toBeVisible();
  await SettingsButton.click({ timeout: 1000 });
};

export const goToRequests = async (page: Page) => {
  await page.goto(host);

  const SettingsButton = page.locator('a[href="/settings/requests"]');
  await expect(SettingsButton).toBeVisible();
  await SettingsButton.click({ timeout: 1000 });
};

export const goToRoomSettings = async (page: Page) => {
  await page.goto(host);

  const SettingsButton = page.locator('a[href="/settings/rooms"]');
  await expect(SettingsButton).toBeVisible();
  await SettingsButton.click({ timeout: 1000 });
};

export const goToUserSettings = async (page: Page) => {
  await page.goto(host);

  const SettingsButton = page.locator('a[href="/settings/users"]');
  await expect(SettingsButton).toBeVisible();
  await SettingsButton.click({ timeout: 1000 });
};

export const goToSystemConfig = async (page: Page) => {
  await page.goto(host);

  const ConfigButton = page.locator('a[href="/settings/configuration"]');
  await expect(ConfigButton).toBeVisible();
  await ConfigButton.click({ timeout: 1000 });
};

export const exists = async (page: Page, data: users.UserData) => {
  await goToUserSettings(page);

  // open the filter menu:
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

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

export const getTemporaryPass = async (page: Page, data: users.UserData) => {
  // navigate to the users page:
  await goToUserSettings(page);

  // open the filter menu:
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

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

  return pass;
};

export const create = async (page: Page, data: users.UserData): Promise<TempPass> => {
  await goToUserSettings(page);

  // click the add user button - using reliable selector:
  await page.getByTestId('add-users-button').click({ timeout: 1000 });

  // fill in the necessary information
  await page.fill('input[name="displayname"]', data.displayName);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="realname"]', data.realName);

  //await page.fill('input[name="userlevel"]', data.role.toString());

  await page.getByTestId('rolefield').click({ timeout: 1000 });

  await page.locator(`li[data-value="${data.role}"]`).click({ timeout: 1000 });

  await page.locator('div[contenteditable="true"]').fill(data.about);

  // submit the form - using reliable selector:
  await page.getByTestId('submit-user-form').click({ timeout: 1000 });

  // now we need to copy the temporary password out so the new user
  //  can log in with it.
  //  because users are hidden behind pagination, we use the admin
  //  filters to search for the user on the user page.

  const pass = await getTemporaryPass(page, data);

  return pass;
};

export const remove = async (page: Page, data: users.UserData) => {
  await goToUserSettings(page);

  // open the filter menu:
  const FilterButton = page.locator('#filter-toggle-button');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click({ timeout: 1000 });

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-field-select').click({ timeout: 1000 });
  await page.locator('li[data-value="username"]').click({ timeout: 1000 });

  // filter by our user name
  await page.fill('#filter-value-input', data.username);

  // find the user's row in the table and select the checkbox for actions

  const row = page.locator('table tr').filter({ hasText: data.username });
  const checkbox = row.locator('input');
  await expect(checkbox).toBeVisible();
  await checkbox.check();

  // click the remove use button
  const ButtonRemoveUser = page.getByTestId('remove-users-button');
  expect(ButtonRemoveUser).toBeDefined();

  await ButtonRemoveUser.click({ timeout: 1000 });

  const ButtonConfirmDelete = page.getByTestId('confirm-delete-users-button');

  expect(ButtonConfirmDelete).toBeDefined();

  await ButtonConfirmDelete.click({ timeout: 1000 });

  // confirm the user does not show up in the table list
  await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0);
};

// Helper function to log in a user
export const login = async (page: Page, data: users.UserData) => {
  await page.goto(host);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);

  await page.locator('button[type="submit"]').click({ timeout: 1000 });

  // Wait for successful login by checking for the rooms page heading
  await expect(page.locator('#rooms-heading')).toBeVisible();
};

export const firstLoginFlow = async (page: Page, data: users.UserData, tempPass: string) => {
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
