import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS, WAIT_STATES } from './constants';

/**
 * Test helper utilities for common operations
 * These helpers reduce boilerplate and improve test readability
 */

/**
 * Wait for network to be idle
 * @param page - Playwright Page object
 * @param timeout - Optional custom timeout
 */
export async function waitForNetworkIdle(page: Page, timeout = TIMEOUTS.NETWORK) {
  await page.waitForLoadState(WAIT_STATES.NETWORK_IDLE as any, { timeout });
}

/**
 * Wait for page to be fully loaded
 * @param page - Playwright Page object
 * @param timeout - Optional custom timeout
 */
export async function waitForPageLoad(page: Page, timeout = TIMEOUTS.MEDIUM) {
  await page.waitForLoadState(WAIT_STATES.LOAD as any, { timeout });
}

/**
 * Fill a form field by label
 * @param page - Playwright Page object
 * @param label - Label text to find the input
 * @param value - Value to fill
 */
export async function fillByLabel(page: Page, label: string, value: string) {
  await page.getByLabel(label).fill(value);
}

/**
 * Click a button by test ID
 * @param page - Playwright Page object
 * @param testId - data-testid value
 * @param timeout - Optional custom timeout
 */
export async function clickByTestId(page: Page, testId: string, timeout = TIMEOUTS.SHORT) {
  await page.getByTestId(testId).click({ timeout });
}

/**
 * Wait for element to be visible by test ID
 * @param page - Playwright Page object
 * @param testId - data-testid value
 * @param timeout - Optional custom timeout
 */
export async function waitForTestId(page: Page, testId: string, timeout = TIMEOUTS.SHORT) {
  await page.getByTestId(testId).waitFor({ state: 'visible', timeout });
}

/**
 * Check if element count matches expected
 * @param locator - Playwright Locator
 * @param count - Expected count
 */
export async function expectElementCount(locator: Locator, count: number) {
  await expect(locator).toHaveCount(count);
}

/**
 * Wait and expect element to be visible
 * @param locator - Playwright Locator
 * @param timeout - Optional custom timeout
 */
export async function expectVisible(locator: Locator, timeout = TIMEOUTS.SHORT) {
  await expect(locator).toBeVisible({ timeout });
}

/**
 * Wait and expect element to be hidden
 * @param locator - Playwright Locator
 * @param timeout - Optional custom timeout
 */
export async function expectHidden(locator: Locator, timeout = TIMEOUTS.SHORT) {
  await expect(locator).toBeHidden({ timeout });
}

/**
 * Retry an async operation with exponential backoff
 * @param operation - Async function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in ms (doubles each retry)
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Take a screenshot with a descriptive name
 * @param page - Playwright Page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `tests/screenshots/${name}-${Date.now()}.png`, fullPage: true });
}

/**
 * Get element text content safely
 * @param locator - Playwright Locator
 * @returns Text content or empty string if not found
 */
export async function getTextContent(locator: Locator): Promise<string> {
  try {
    return (await locator.textContent()) || '';
  } catch {
    return '';
  }
}

/**
 * Check if element exists (without waiting)
 * @param locator - Playwright Locator
 * @returns true if element exists
 */
export async function elementExists(locator: Locator): Promise<boolean> {
  try {
    await locator.waitFor({ state: 'attached', timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}
