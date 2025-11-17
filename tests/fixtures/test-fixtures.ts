import { Page } from '@playwright/test';
import { UserData } from '../support/types';
import { test as userTest } from './user.fixture';

/**
 * Main test fixtures for Aula e2e tests
 * Combines all fixtures: browser, user, and common utilities
 *
 * This is the ONE fixture file that tests should import from:
 *   import { test, expect } from '../../fixtures/test-fixtures';
 *
 * Provides:
 * - adminPage: Pre-authenticated admin browser page
 * - userPage: Pre-authenticated user browser page
 * - studentPage: Pre-authenticated student browser page
 * - userConfig: User data object
 * - studentConfig: Student data object
 * - ensureUser: Function to create/get users
 * - createUserPage: Function to create pages for any user (from browser.fixture)
 */

interface AulaFixtures {
  /** User page - pre-authenticated standard user */
  userPage: Page;

  /** Student page - pre-authenticated student user */
  studentPage: Page;

  /** User configuration data */
  userConfig: UserData;

  /** Student configuration data */
  studentConfig: UserData;
}

/**
 * Configure test with serial mode by default (for mutation tests)
 */
export const test = userTest.extend<AulaFixtures>({
  /**
   * User config - creates/retrieves user data
   * This ensures the user exists in the system before creating their page
   */
  userConfig: async ({ ensureUser }, use) => {
    const user = await ensureUser('user', 20);
    await use(user);
  },

  /**
   * User page - creates authenticated page for the user
   * Depends on userConfig to ensure user exists
   */
  userPage: async ({ userConfig, createUserPage }, use) => {
    const page = await createUserPage(userConfig.username);
    await use(page);
    // Cleanup handled by createUserPage fixture
  },

  /**
   * Student config - creates/retrieves student data
   */
  studentConfig: async ({ ensureUser }, use) => {
    const student = await ensureUser('student', 20);
    await use(student);
  },

  /**
   * Student page - creates authenticated page for the student
   * Depends on studentConfig to ensure student exists
   */
  studentPage: async ({ studentConfig, createUserPage }, use) => {
    const page = await createUserPage(studentConfig.username);
    await use(page);
    // Cleanup handled by createUserPage fixture
  },
});

// Set reasonable default timeout (30s instead of 60s)
// Individual tests can override with test.slow() if needed
test.setTimeout(30000);

export { expect } from '@playwright/test';
