import { expect, Page } from '@playwright/test';
import * as shared from '../shared';

const host = shared.getHost();

type TempPass = string;

export const create = async (page: Page, data: shared.UserData): Promise<TempPass> => {
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
  await page.locator('div[contenteditable="true"]').fill(data.about);

  // submit the form
  await page.getByRole('button', { name: 'Bestätigen' }).click();

  // find the new user in the user table
  const row = page.locator('table tr').filter({ hasText: data.username });

  // make sure that row actually exists
  await expect(row).toHaveCount(1);

  // get the temporary password for the user to return and use later
  const viewPassButton = row.locator('button');
  await viewPassButton.click();

  const pass = await row.locator('div[role="button"] span').textContent();

  expect(pass).toBeTruthy();
  return pass;
};

export const remove = async (page: Page, data: shared.UserData) => {
  // start at home
  await page.goto(host);
  // navigate to the users page:
  await page.locator('a[href="/settings/users"]').click();

  const row = page.locator('table tr').filter({ hasText: data.username });

  const checkbox = row.locator('input');

  expect(checkbox).toBeDefined();

  await checkbox.check();

  const ButtonRemoveUser = page.getByRole('button', { name: 'Benutzer Entfernen' });

  expect(ButtonRemoveUser).toBeDefined();

  await ButtonRemoveUser.click();

  const ButtonConfirmDelete = page.getByRole('button', { name: 'Löschen' });

  expect(ButtonConfirmDelete).toBeDefined();

  await ButtonConfirmDelete.click();

  // confirm the user does not show up
  await expect(page.locator('table tr').filter({ hasText: data.username })).toHaveCount(0);
};

// Helper function to log in a user
export const login = async (page: Page, data: shared.UserData) => {
  await page.goto(host);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', data.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('h2')).toHaveText('Dashboard');
};

export const firstLogin = async (page: Page, data: shared.UserData, tempPass: string) => {
  await page.goto(host);
  await page.fill('input[name="username"]', data.username);
  await page.fill('input[name="password"]', tempPass);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.fill('input[name="oldPassword"]', tempPass);
  await page.fill('input[name="newPassword"]', data.password);
  await page.fill('input[name="confirmPassword"]', data.password);
  await page.getByRole('button', { name: 'Speichern' }).click();

  await login(page, data);
};
