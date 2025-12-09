/**
 * Centralized test configuration
 * Contains all constants and settings used across tests
 */
export const TestConstants = {
  // Timeouts
  DEFAULT_TIMEOUT: 60000,
  LOGIN_TIMEOUT: 10000,
  NAVIGATION_TIMEOUT: 5000,

  // Test data
  DEFAULT_PASSWORD: 'aulapassword123',
  TEST_DESCRIPTION: 'created during automated testing',

  // Box settings
  DEFAULT_DISCUSSION_DAYS: 6,
  DEFAULT_VOTING_DAYS: 10,
  DEFAULT_PHASE: 10,

  // User roles
  ROLES: {
    GUEST: 10,
    USER: 20,
    MODERATOR: 30,
    MODERATOR_V: 31,
    SUPER_MODERATOR: 40,
    SUPER_MODERATOR_V: 41,
    PRINCIPAL: 44,
    PRINCIPAL_V: 45,
    ADMIN: 50,
    TECH_ADMIN: 60,
  },

  // Common selectors (if needed)
  SELECTORS: {
    LOADING: '[data-testid="loading"]',
    ERROR: '[data-testid="error"]',
    SUCCESS: '[data-testid="success"]',
  },
};

/**
 * Test environment configuration
 */
export class TestEnvironment {
  static getHost(): string {
    return process.env.APP_FRONTEND_HOST || 'http://localhost:3000';
  }

  static isCI(): boolean {
    return !!process.env.CI;
  }

  static getTimeout(operation: keyof typeof TestConstants): number {
    switch (operation) {
      case 'DEFAULT_TIMEOUT':
        return TestConstants.DEFAULT_TIMEOUT;
      default:
        return TestConstants.DEFAULT_TIMEOUT;
    }
  }
}
