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
// Toast trigger buttons are sr-only in the public NotFound view.
// Use evaluate() to dispatch click directly — bypasses sr-only clip/size constraints.

async function triggerToast(page: import('@playwright/test').Page, type: 'success' | 'error' | 'warning' | 'info') {
  await page.evaluate((t) => {
    (document.querySelector(`[data-testid="test-toast-${t}"]`) as HTMLButtonElement)?.click();
  }, type);
}

async function gotoPublicNotFound(page: import('@playwright/test').Page, dbInstanceCode: string) {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  // Navigate while unauthenticated to land on the public NotFound (which has the toast triggers)
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('not-found-view')).toBeVisible();
}

test('Toast - success appears and can be dismissed', async ({ page, dbInstanceCode }) => {
  await gotoPublicNotFound(page, dbInstanceCode);
  await triggerToast(page, 'success');

  const toast = page.locator('[role="region"][aria-label="Notifications"] [role="status"]');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Success toast');

  await toast.getByRole('button').click();
  await expect(toast).not.toBeVisible();
});

test('Toast - error appears and can be dismissed with Escape', async ({ page, dbInstanceCode }) => {
  await gotoPublicNotFound(page, dbInstanceCode);
  await triggerToast(page, 'error');

  const toast = page.locator('[role="region"][aria-label="Notifications"] [role="alert"]').first();
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Error toast');

  await toast.getByRole('button').focus();
  await page.keyboard.press('Escape');
  await expect(toast).not.toBeVisible();
});

test('Toast - multiple toasts stack and dismiss individually', async ({ page, dbInstanceCode }) => {
  await gotoPublicNotFound(page, dbInstanceCode);
  await triggerToast(page, 'success');
  await triggerToast(page, 'info');

  const region = page.locator('[role="region"][aria-label="Notifications"]');
  await expect(region.locator('[role="status"]')).toHaveCount(2);

  await region.locator('[role="status"]').first().getByRole('button').click();
  await expect(region.locator('[role="status"]')).toHaveCount(1);
});

// ── Tooltip ───────────────────────────────────────────────────────────────────

async function gotoTooltipPage(page: import('@playwright/test').Page, dbInstanceCode: string) {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('not-found-view')).toBeVisible();
}

test('Tooltip - shows on hover and hides on mouse leave', async ({ page, dbInstanceCode }) => {
  await gotoTooltipPage(page, dbInstanceCode);

  const tooltip = page.getByTestId('not-found-view').locator('[role="tooltip"]');
  await expect(tooltip).toBeHidden();

  await tooltip.locator('..').hover();
  await expect(tooltip).toBeVisible();

  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
});

test('Tooltip - shows on focus and hides on blur', async ({ page, dbInstanceCode }) => {
  await gotoTooltipPage(page, dbInstanceCode);

  const notFoundView = page.getByTestId('not-found-view');
  const tooltip = notFoundView.locator('[role="tooltip"]');
  // The Tooltip component adds aria-describedby to the trigger element
  const triggerButton = notFoundView.locator('button[aria-describedby]');
  await expect(tooltip).toBeHidden();

  await triggerButton.focus();
  await expect(tooltip).toBeVisible();

  await triggerButton.blur();
  await expect(tooltip).toBeHidden();
});

test('Tooltip - hides on Escape key', async ({ page, dbInstanceCode }) => {
  await gotoTooltipPage(page, dbInstanceCode);

  const notFoundView = page.getByTestId('not-found-view');
  const tooltip = notFoundView.locator('[role="tooltip"]');
  const triggerButton = notFoundView.locator('button[aria-describedby]');

  await triggerButton.focus();
  await expect(tooltip).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
});
