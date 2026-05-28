import { expect, test } from '../../fixtures/aula-tests-fixture';
import { TestConstants } from '../../support/config';
import * as shared from '../../support/utils';

const host = shared.getHost();
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = TestConstants.DEFAULT_PASSWORD;

/**
 * Login flow tests
 *
 * Covers instance code entry (multi-instance only) and login form validation.
 * Each test gets a fresh, unauthenticated page — no pre-logged-in fixture contexts needed.
 */

test('Instance code entry', async ({ browser, dbInstanceCode, baselineLoaded: _ }) => {
  const page = await browser.newPage();
  await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });

  // Skip if the app doesn't show an instance code input — single-instance setup
  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if (!await instanceCodeInput.isVisible()) {
    test.skip(true, 'Single-instance setup — skipping instance code tests');
    return;
  }

  await test.step('Submitting a wrong instance code shows an error message', async () => {
    await page.fill('input[name="instanceCode"]', 'WRONG');
    await page.getByTestId('submit-instance-code').click();

    await expect(page.getByTestId('error-alert')).toBeVisible();
  });

  await test.step('Submitting the correct instance code proceeds to the login form', async () => {
    await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });

    await page.fill('input[name="instanceCode"]', dbInstanceCode);
    await page.getByTestId('submit-instance-code').click();

    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 10000 });
  });

  await test.step('Clicking the instance code chip clears the code and returns to /code', async () => {
    await page.goto(`${host}/code`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="instanceCode"]')).toBeVisible();
    await page.fill('input[name="instanceCode"]', dbInstanceCode);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });

    const chip = page.getByTestId('current-instance-code');
    await expect(chip).toBeVisible();
    await chip.click();

    await expect(page).toHaveURL(/\/code/);
    await expect(page.locator('input[name="instanceCode"]')).toBeVisible();
  });

  await page.close();
});

test('Login form', async ({ browser, dbInstanceCode, baselineLoaded: _ }) => {
  const page = await browser.newPage();

  await page.goto(host, { waitUntil: 'domcontentloaded' });

  // If the app redirected to /code (multi-instance with no stored code), submit the instance code first.
  // validateAndSaveInstanceCode must run via the form — setting localStorage directly is insufficient
  // because the login flow also requires api_url to be set.
  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if (await instanceCodeInput.isVisible()) {
    await instanceCodeInput.fill(dbInstanceCode);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
  }

  await expect(page.locator('input[name="username"]')).toBeVisible();

  await test.step('Submitting wrong credentials shows an error message', async () => {
    await page.fill('input[name="username"]', 'wrong_user_xyz');
    await page.fill('input[name="password"]', 'wrong_password');
    await page.getByTestId('submit-login').click();

    await expect(page.getByTestId('error-alert')).toBeVisible();
  });

  await test.step('Submitting correct credentials logs the user in', async () => {
    // Reload to clear any error state from the previous step
    await page.goto(host, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="username"]')).toBeVisible();

    await page.fill('input[name="username"]', ADMIN_USERNAME);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.getByTestId('submit-login').click();

    await expect(page.locator('#rooms-heading')).toBeVisible({ timeout: 20000 });
  });

  await page.close();
});
