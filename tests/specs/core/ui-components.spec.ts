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

// ── Toast ─────────────────────────────────────────────────────────────────────

async function gotoNotFound(page: import('@playwright/test').Page, dbInstanceCode: string) {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('not-found-view')).toBeVisible();
}

test('Toast - success appears and can be dismissed', async ({ page, dbInstanceCode }) => {
  await gotoNotFound(page, dbInstanceCode);

  await page.getByTestId('test-toast-success').click({ force: true });

  const toast = page.locator('[role="region"][aria-label="Notifications"] [role="status"]');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Success toast');

  await toast.getByRole('button').click();
  await expect(toast).not.toBeVisible();
});

test('Toast - error appears and can be dismissed with Escape', async ({ page, dbInstanceCode }) => {
  await gotoNotFound(page, dbInstanceCode);

  await page.getByTestId('test-toast-error').click({ force: true });

  const toast = page.locator('[role="region"][aria-label="Notifications"] [role="alert"]').first();
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Error toast');

  await toast.getByRole('button').focus();
  await page.keyboard.press('Escape');
  await expect(toast).not.toBeVisible();
});

test('Toast - multiple toasts stack and dismiss individually', async ({ page, dbInstanceCode }) => {
  await gotoNotFound(page, dbInstanceCode);

  await page.getByTestId('test-toast-success').click({ force: true });
  await page.getByTestId('test-toast-info').click({ force: true });

  const region = page.locator('[role="region"][aria-label="Notifications"]');
  await expect(region.locator('[role="status"]')).toHaveCount(2);

  // Dismiss the first one
  await region.locator('[role="status"]').first().getByRole('button').click();
  await expect(region.locator('[role="status"]')).toHaveCount(1);
});

// ── Tooltip ───────────────────────────────────────────────────────────────────

test('Tooltip - shows on hover and hides on mouse leave', async ({ page, dbInstanceCode }) => {
  // The NotFoundView has a Tooltip wrapping the error message — use it as test subject
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();

  const notFoundView = page.getByTestId('not-found-view');
  const tooltip = notFoundView.locator('[role="tooltip"]');

  // Tooltip is initially hidden
  await expect(tooltip).toHaveAttribute('aria-hidden', 'true');

  // Hover over the tooltip trigger to show it
  await tooltip.locator('..').hover();
  await expect(tooltip).toHaveAttribute('aria-hidden', 'false');

  // Move mouse away — tooltip hides
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveAttribute('aria-hidden', 'true');
});

test('Tooltip - shows on focus and hides on blur', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();

  const notFoundView = page.getByTestId('not-found-view');
  const tooltip = notFoundView.locator('[role="tooltip"]');
  const tooltipWrapper = tooltip.locator('..');

  // Focus the wrapper — tooltip shows
  await tooltipWrapper.focus();
  await expect(tooltip).toHaveAttribute('aria-hidden', 'false');

  // Blur — tooltip hides
  await tooltipWrapper.blur();
  await expect(tooltip).toHaveAttribute('aria-hidden', 'true');
});

test('Tooltip - hides on Escape key', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();

  const notFoundView = page.getByTestId('not-found-view');
  const tooltip = notFoundView.locator('[role="tooltip"]');
  const tooltipWrapper = tooltip.locator('..');

  // Focus to show
  await tooltipWrapper.focus();
  await expect(tooltip).toHaveAttribute('aria-hidden', 'false');

  // Escape hides it
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveAttribute('aria-hidden', 'true');
});
