import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost/');
});

test('test', async ({ page }) => {
  const storage = await page.context().storageState();
  console.log(storage.origins[0].localStorage);
  await page.getByRole('textbox', { name: 'Benutzername' }).click();
  await page.getByRole('textbox', { name: 'Benutzername' }).fill('admin');
  await page.getByRole('textbox', { name: 'Benutzername' }).press('Tab');
  await page.getByRole('textbox', { name: 'Passwort' }).fill('aula');
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await expect(page.getByRole('link', { name: 'AULA AULA background' })).toBeVisible();
});
