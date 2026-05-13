import { expect, test } from '@playwright/test';
import * as shared from '../../support/utils';

const host = shared.getHost();
const INSTANCE_CODE = process.env.INSTANCE_CODE;
const IS_MULTI = !!INSTANCE_CODE && INSTANCE_CODE !== 'SINGLE';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aula';

/**
 * Login flow tests
 *
 * Covers instance code entry (multi-instance only) and login form validation.
 * Each test gets a fresh, unauthenticated browser context — no fixtures needed.
 *
 * Tests run serially because they follow a sequential user journey:
 * enter code → verify error → enter correct code → login error → login success
 */

test.describe.serial('Instance code entry', () => {
  test.skip(!IS_MULTI, 'Single-instance setup — skipping instance code tests');

  test('submitting a wrong instance code shows an error message', async ({ page }) => {
    await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });

    await page.fill('input[name="instanceCode"]', 'WRONG_CODE_XYZ');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('submitting the correct instance code proceeds to the login form', async ({ page }) => {
    await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });

    await page.fill('input[name="instanceCode"]', INSTANCE_CODE!);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 10000 });
  });

  test('clicking the instance code chip clears the code and returns to /code', async ({ page }) => {
    // Enter the code first so the dismissible chip (with onClick) is rendered instead of the passive status chip.
    await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="instanceCode"]')).toBeVisible();
    await page.fill('input[name="instanceCode"]', INSTANCE_CODE!);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });

    const chip = page.getByTestId('current-instance-code');
    await expect(chip).toBeVisible();
    await chip.click();

    await expect(page).toHaveURL(/\/code/);
    await expect(page.locator('input[name="instanceCode"]')).toBeVisible();
  });
});

test.describe.serial('Login form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });

    if (IS_MULTI) {
      // Go through the code form so that validateAndSaveInstanceCode runs and sets api_url in localStorage.
      // Setting 'code' directly via localStorage is insufficient — the new login flow also requires api_url.
      await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('input[name="instanceCode"]')).toBeVisible();
      await page.fill('input[name="instanceCode"]', INSTANCE_CODE!);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
    }

    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('submitting wrong credentials shows an error message', async ({ page }) => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });

    await page.fill('input[name="username"]', 'wrong_user_xyz');
    await page.fill('input[name="password"]', 'wrong_password');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByTestId('error-alert')).toBeVisible();
  });

  test('submitting correct credentials logs the user in', async ({ page }) => {
    await page.fill('input[name="username"]', ADMIN_USERNAME);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: 20000 });
  });
});
