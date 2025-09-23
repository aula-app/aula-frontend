import { test, Page, BrowserContext } from '@playwright/test';
import { chromium } from '@playwright/test';

/**
 * Helper functions for working with saved authentication states
 */
export class AuthHelpers {
  /**
   * Use a specific user's authentication state for a test
   * @param userName - The name of the user (alice, bob, mallory, burt, rainer, admin)
   * @returns Test configuration with the user's storage state
   */
  static useAuthState(userName: string) {
    return test.use({
      storageState: `tests/auth-states/${userName}.json`,
    });
  }

  /**
   * Create a new page with a specific user's authentication state
   * @param userName - The name of the user
   * @returns A new page with the user's authentication loaded
   */
  static async createAuthenticatedPage(userName: string): Promise<{ page: Page; context: BrowserContext }> {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      storageState: `tests/auth-states/${userName}.json`,
    });
    const page = await context.newPage();

    return { page, context };
  }

  /**
   * Check if authentication states are available
   * @returns Promise<boolean> - true if auth states exist
   */
  static async authStatesExist(): Promise<boolean> {
    try {
      const fs = await import('fs/promises');
      const users = ['alice', 'bob', 'mallory', 'burt', 'rainer', 'admin'];

      const checks = await Promise.all(
        users.map(async (user) => {
          try {
            await fs.access(`tests/auth-states/${user}.json`);
            return true;
          } catch {
            return false;
          }
        })
      );

      return checks.every((exists) => exists);
    } catch {
      return false;
    }
  }
}

/**
 * Decorator for tests that require authenticated users
 * Usage:
 * ```typescript
 * requiresAuth('alice', () => {
 *   test('Alice can do something', async ({ page }) => {
 *     // Alice is already logged in
 *   });
 * });
 * ```
 */
export function requiresAuth(userName: string, testSuite: () => void) {
  test.describe(`Tests requiring ${userName} authentication`, () => {
    test.use({ storageState: `tests/auth-states/${userName}.json` });
    testSuite();
  });
}
