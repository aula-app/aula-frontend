import { test } from '@playwright/test';
import * as shared from './shared';
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
      fixtures.init();

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
      if (!browsers.admins_browser) {
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
      if (!browsers.admins_browser) {
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
 * Test data builders for common test entities
 */
export class TestDataBuilder {
  static createRoom(suffix = '', users = [fixtures.rainer, fixtures.alice, fixtures.bob, fixtures.mallory]) {
    return {
      name: 'room-' + shared.getRunId() + (suffix ? '-' + suffix : ''),
      description: 'created during automated testing',
      users: users,
    };
  }

  static createIdea(suffix = '') {
    return {
      name: 'test-idea-' + shared.getRunId() + (suffix ? '-' + suffix : ''),
      description: 'generated during testing data',
    };
  }

  static createBox(ideas = [], suffix = '') {
    return {
      name: 'test-box-' + shared.getRunId() + (suffix ? '-' + suffix : ''),
      description: 'generated during automated testing',
      ideas: ideas,
      discussionDays: 6,
      votingDays: 10,
      phase: 10,
    };
  }

  static createUserData(username: string, role = 20) {
    const sym = shared.gensym();
    return {
      username: username + sym,
      realName: username + sym,
      displayName: username + sym,
      role: role,
      password: 'aula-' + username + sym,
      about: 'generated in e2e tests',
    };
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
