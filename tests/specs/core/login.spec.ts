import { expect, test } from '../../fixtures/aula-tests-fixture';
import { TEST_IDS } from '../../../src/test-ids';
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
  await page.goto(host, { waitUntil: 'domcontentloaded' });

  // Skip if the app doesn't show an editable instance code input — single-instance or already stored
  const instanceCodeInput = page.getByTestId('instance-code');
  if (!await instanceCodeInput.isVisible() || !await instanceCodeInput.isEnabled()) {
    test.skip(true, 'Single-instance setup or code already stored — skipping instance code tests');
    return;
  }

  await test.step('Submitting a wrong instance code shows a field error', async () => {
    await instanceCodeInput.fill('WRONG');
    await page.getByTestId('instance-code-confirm').click();

    await expect(instanceCodeInput).toHaveAttribute('aria-invalid', 'true');
  });

  await test.step('Submitting the correct instance code locks the field', async () => {
    await instanceCodeInput.fill(dbInstanceCode);
    await page.getByTestId('instance-code-confirm').click();

    await expect(instanceCodeInput).toBeDisabled({ timeout: 10000 });
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  await test.step('Clicking the Edit button unlocks the field and clears the value', async () => {
    await page.getByTestId('instance-code-edit').click();

    await expect(instanceCodeInput).toBeEnabled();
    await expect(instanceCodeInput).toHaveValue('');
  });

  await page.close();
});

test('Login form', async ({ browser, dbInstanceCode, baselineLoaded: _ }) => {
  const page = await browser.newPage();

  await page.goto(host, { waitUntil: 'domcontentloaded' });

  // If the instance code field is visible and editable (multi-instance, no stored code),
  // validate it first so api_url is set in localStorage before the login form runs.
  const instanceCodeInput = page.getByTestId('instance-code');
  if (await instanceCodeInput.isVisible() && await instanceCodeInput.isEnabled()) {
    await instanceCodeInput.fill(dbInstanceCode);
    await page.getByTestId('instance-code-confirm').click();
    await expect(instanceCodeInput).toBeDisabled({ timeout: 10000 });
  }

  await expect(page.locator('input[name="username"]')).toBeVisible();

  await test.step('Submitting wrong credentials shows an error message', async () => {
    await page.fill('input[name="username"]', 'wrong_user_xyz');
    await page.fill('input[name="password"]', 'wrong_password');
    await page.getByTestId('submit-login').click();

    await expect(page.getByTestId(TEST_IDS.TOAST_ERROR)).toBeVisible();
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
