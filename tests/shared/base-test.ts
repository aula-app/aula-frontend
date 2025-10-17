import { test } from '@playwright/test';
import * as fixtures from '../fixtures/users';
import * as browsers from './interactions/browsers';
import { AuthHelpers } from './auth-helpers';

/**
 * Base test configuration for all e2e tests
 * Handles common setup and teardown operations
 */
export class BaseTest {
  static configure() {
    // Force tests to run sequentially due to mutation dependencies
    test.describe.configure({ mode: 'serial' });

    // Set default timeout for complex operations
    test.describe.configure({ timeout: 60000 });
  }

  static setupHooks() {
    test.beforeAll(async () => {
      // Only initialize fixtures if not already done
      if (!fixtures.get('admin') && Object.keys(fixtures.all()).length === 0) {
        fixtures.init();
      }

      // Check if authentication states are available
      const authStatesExist = await AuthHelpers.authStatesExist();

      if (authStatesExist) {
        // Load authentication states
        try {
          await browsers.recallFromAuthStates();
          console.log('✅ Successfully loaded authentication states');
        } catch (error) {
          console.log('Failed to load auth states, falling back to fresh initialization');
          await browsers.init();
        }
      } else {
        // Try to recall temp states or initialize fresh
        try {
          await browsers.recall();
          console.log('✅ Successfully loaded temp states');
        } catch (tempError) {
          console.log('No existing states found, initializing fresh browsers...');
          await browsers.init();
        }
      }
    });

    test.beforeEach(async () => {
      // Ensure browsers are available for each test
      if (!browsers.getUserBrowser('admin')) {
        console.log('Browsers not available, initializing...');
        await browsers.init();
      }
    });

    test.afterEach(async () => {
      await browsers.pickle();
    });
  }

  /**
   * Setup hooks that automatically ensure authentication states exist
   * Use this for test suites that require authenticated users
   */
  static setupWithAuth() {
    test.describe.configure({ mode: 'serial' });
    test.describe.configure({ timeout: 60000 });

    test.beforeAll(async () => {
      fixtures.init();

      // Ensure authentication states exist (runs setup if needed)
      await AuthHelpers.ensureAuthStates();

      // Load authentication states
      try {
        await browsers.recallFromAuthStates();
        console.log('✅ Successfully loaded authentication states');
      } catch (error) {
        console.log('Failed to load auth states after setup, something went wrong');
        throw error;
      }
    });

    test.beforeEach(async () => {
      // Ensure browsers are available for each test
      if (!browsers.getUserBrowser('admin')) {
        console.log('Browsers not available, initializing...');
        await browsers.init();
      }
    });

    test.afterEach(async () => {
      await browsers.pickle();
    });
  }
}

/**
 * Common test patterns wrapper
 */
export function describeWithSetup(description: string, callback: () => void) {
  test.describe(description, () => {
    BaseTest.configure();
    BaseTest.setupHooks();
    callback();
  });
}

/**
 * Test wrapper that ensures authentication states exist before running
 * Use this for test suites that require authenticated users
 */
export function describeWithAuth(description: string, callback: () => void) {
  test.describe(description, () => {
    BaseTest.setupWithAuth();
    callback();
  });
}
