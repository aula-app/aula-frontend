import { test } from '@playwright/test';
import * as shared from './shared';
import * as fixtures from '../fixtures/users';
import * as browsers from './page_interactions/browsers';

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
    });

    test.beforeEach(async () => {
      await browsers.recall();
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