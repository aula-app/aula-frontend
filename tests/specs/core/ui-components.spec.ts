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

test('Tooltip - shows on hover and hides on mouse leave', async ({ page, dbInstanceCode }) => {
  // The NotFoundView has a Tooltip wrapping the error message — use it as test subject
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();

  const tooltip = page.getByRole('tooltip');

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

  const tooltipWrapper = page.getByRole('tooltip').locator('..');

  // Focus the wrapper — tooltip shows
  await tooltipWrapper.focus();
  await expect(page.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');

  // Blur — tooltip hides
  await tooltipWrapper.blur();
  await expect(page.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'true');
});

test('Tooltip - hides on Escape key', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });
  await ensureInstanceCode(page, dbInstanceCode);
  await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('not-found-view')).toBeVisible();

  const tooltipWrapper = page.getByRole('tooltip').locator('..');

  // Focus to show
  await tooltipWrapper.focus();
  await expect(page.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');

  // Escape hides it
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'true');
});
