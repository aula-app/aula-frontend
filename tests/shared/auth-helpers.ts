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

  /**
   * Run setup (user creation) if authentication states don't exist
   * This should be called in test.beforeAll for tests that need authenticated users
   */
  static async ensureAuthStates() {
    const authStatesExist = await AuthHelpers.authStatesExist();

    if (!authStatesExist) {
      console.log('🔧 Authentication states not found, running user creation setup...');

      // Import the setup functions
      const userData = await import('../fixtures/users');
      const browsers = await import('./interactions/browsers');
      const users = await import('./interactions/users');

      // Initialize
      userData.init();
      await browsers.init();

      try {
        // Run the complete setup flow
        await users.login(browsers.admin, userData.admin);

        // Create users and store their temporary passwords
        console.log('creating...', userData.alice.username);
        userData.temporaryPasswords.alice = await users.create(browsers.admin, userData.alice);

        console.log('creating...', userData.bob.username);
        userData.temporaryPasswords.bob = await users.create(browsers.admin, userData.bob);

        console.log('creating...', userData.mallory.username);
        userData.temporaryPasswords.mallory = await users.create(browsers.admin, userData.mallory);

        console.log('creating...', userData.burt.username);
        userData.temporaryPasswords.burt = await users.create(browsers.admin, userData.burt);

        console.log('creating...', userData.rainer.username);
        userData.temporaryPasswords.rainer = await users.create(browsers.admin, userData.rainer);

        // Run first login flows
        await Promise.all([
          users.firstLoginFlow(browsers.alice, userData.alice, userData.temporaryPasswords.alice),
          users.firstLoginFlow(browsers.bob, userData.bob, userData.temporaryPasswords.bob),
          users.firstLoginFlow(browsers.mallory, userData.mallory, userData.temporaryPasswords.mallory),
          users.firstLoginFlow(browsers.burt, userData.burt, userData.temporaryPasswords.burt),
          users.firstLoginFlow(browsers.rainer, userData.rainer, userData.temporaryPasswords.rainer),
        ]);

        // Logout users to ensure clean state
        await Promise.all([
          users.logout(browsers.alice),
          users.logout(browsers.bob),
          users.logout(browsers.mallory),
          users.logout(browsers.burt),
          users.logout(browsers.rainer),
        ]);

        // Login with permanent passwords
        await Promise.all([
          users.login(browsers.alice, userData.alice),
          users.login(browsers.bob, userData.bob),
          users.login(browsers.mallory, userData.mallory),
          users.login(browsers.burt, userData.burt),
          users.login(browsers.rainer, userData.rainer),
        ]);

        // Save authentication states
        await Promise.all([
          browsers.alice.context().storageState({ path: 'tests/auth-states/alice.json' }),
          browsers.bob.context().storageState({ path: 'tests/auth-states/bob.json' }),
          browsers.mallory.context().storageState({ path: 'tests/auth-states/mallory.json' }),
          browsers.burt.context().storageState({ path: 'tests/auth-states/burt.json' }),
          browsers.rainer.context().storageState({ path: 'tests/auth-states/rainer.json' }),
          browsers.admin.context().storageState({ path: 'tests/auth-states/admin.json' }),
        ]);

        console.log('✅ User creation setup completed and authentication states saved');
      } finally {
        await browsers.shutdown();
      }
    } else {
      console.log('✅ Authentication states already exist, skipping setup');
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
