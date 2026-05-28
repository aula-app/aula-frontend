import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as shared from '../../support/utils';

const host = shared.getHost();

/**
 * Ensures the instance code is submitted so api_url is set in localStorage,
 * which is required before any public route renders correctly.
 */
async function ensureInstanceCode(page: import('@playwright/test').Page, dbInstanceCode: string) {
  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if (await instanceCodeInput.isVisible()) {
    await instanceCodeInput.fill(dbInstanceCode);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
  }
}

test('404 page', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);

  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();
});

test('Offline page', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);

  await page.goto(`${host}/offline`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('school-offline-view')).toBeVisible();
});

test('About page', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);

  await page.getByTestId('about-button').click();

  await expect(page.getByTestId('about-view')).toBeVisible();
});

test('Dark mode toggle', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);

  const html = page.locator('html');
  const initialDarkMode = await html.evaluate((el) => el.classList.contains('dark'));

  const toggleButton = page.getByTestId('dark-mode-toggle');
  await expect(toggleButton).toBeVisible();
  await toggleButton.click();

  const newDarkMode = await html.evaluate((el) => el.classList.contains('dark'));
  expect(newDarkMode).toBe(!initialDarkMode);

  // Clicking again restores original state
  await toggleButton.click();
  const restoredDarkMode = await html.evaluate((el) => el.classList.contains('dark'));
  expect(restoredDarkMode).toBe(initialDarkMode);
});

test('Language switch', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);

  const langButton = page.getByTestId('language-switch');
  await expect(langButton).toBeVisible();

  const initialLang = await page.evaluate(() => localStorage.getItem('lang') ?? document.documentElement.lang);
  await langButton.click();

  const newLang = await page.evaluate(() => localStorage.getItem('lang'));
  expect(newLang).not.toBe(initialLang);

  await expect(langButton).toBeVisible();
});
