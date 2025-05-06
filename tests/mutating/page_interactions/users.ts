import { expect, Page } from '@playwright/test';
import * as shared from '../../shared';
import * as users from '../../fixtures/users';

const host = shared.getHost();

type TempPass = string;

export const create = async (page: Page, data: users.UserData): Promise<TempPass> => {
  // start at home
  await page.goto(host);
  // navigate to the users page:
  await page.locator('a[href="/settings/users"]').click();

  // click the add user button:
  await page.getByRole('button', { name: 'Benutzer hinzufügen' }).click();

  // fill in the necessary information
  await page.fill('input[name="displayname"]', data.displayName);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="realname"]', data.realName);

  //await page.fill('input[name="userlevel"]', data.role.toString());

  await page.locator('[data-testing-id="rolefield"]').click();

  await page.locator(`li[data-value="${data.role}"]`).click();

  await page.locator('div[contenteditable="true"]').fill(data.about);

  // submit the form
  await page.getByRole('button', { name: 'Bestätigen' }).click();

  // now we need to copy the temporary password out so the new user
  //  can log in with it.
  //  because users are hidden behind pagination, we use the admin
  //  filters to search for the user on the user page.

  // open the filter menu:
  const FilterButton = page.locator('[aria-label="button-open-filters"]');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click();

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-select-1').click();
  await page.getByRole('option', { name: 'Benutzername' }).click();

  // filter by our user name
  await page.fill('#filter-select-2', data.username);

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: data.username });

  // make sure that row actually exists
  await expect(row).toHaveCount(1);

  // get the temporary password for the user to return and use later
  const viewPassButton = row.locator('button');
  await viewPassButton.click();

  const pass = await row.locator('div[role="button"] span').textContent();

  // temporary password must exist and be pulled out of the page.
  expect(pass).toBeTruthy();

  return pass;
};

export const remove = async (page: Page, data: users.UserData) => {
  // start at home
  await page.goto(host);
  // navigate to the users page:
  await page.locator('a[href="/settings/users"]').click();

  // open the filter menu:
  const FilterButton = page.locator('[aria-label="button-open-filters"]');
  await expect(FilterButton).toBeVisible();
  await FilterButton.click();

  // select "username" from the "filter by" dropdown

  await page.locator('#filter-select-1').click();
  await page.getByRole('option', { name: 'Benutzername' }).click();

  // filter by our user name
  await page.fill('#filter-select-2', data.username);

  // find the user's row in the table and select the checkbox for actions

  const row = page.locator('table tr').filter({ hasText: data.username });
  const checkbox = row.locator('input');
  await expect(checkbox).toBeVisible();
  await checkbox.check();

  // click the remove use button
  const ButtonRemoveUser = page.getByRole('button', { name: 'Benutzer Entfernen' });
  expect(ButtonRemoveUser).toBeDefined();

  await ButtonRemoveUser.click();

  const ButtonConfirmDelete = page.getByRole('button', { name: 'Löschen' });

  expect(ButtonConfirmDelete).toBeDefined();

  await ButtonConfirmDelete.click();

  // confirm the user does not show up in the table list
  await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0);
};

// Helper function to log in a user
export const login = async (page: Page, data: users.UserData) => {
  await page.goto(host);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('h2')).toHaveText('Dashboard');
};

export const firstLoginFlow = async (page: Page, data: users.UserData, tempPass: string) => {
  await page.goto(host);

  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', tempPass);
  await page.getByRole('button', { name: 'Login' }).click();

  const oldPasswordButton = page.locator('input[name="oldPassword"]');
  await expect(oldPasswordButton).toBeVisible();

  await page.fill('input[name="oldPassword"]', tempPass);
  await page.fill('input[name="newPassword"]', data.password);
  await page.fill('input[name="confirmPassword"]', data.password);
  await page.getByRole('button', { name: 'Speichern' }).click();

  await login(page, data);
};
