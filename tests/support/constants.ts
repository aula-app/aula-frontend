/**
 * Test constants and configuration values
 * Centralized location for all magic numbers and timeouts
 */

export const TIMEOUTS = {
  /** Short timeout for fast operations (5s) */
  SHORT: 5000,

  /** Medium timeout for standard operations (10s) */
  MEDIUM: 10000,

  /** Long timeout for complex operations (30s) */
  LONG: 30000,

  /** Network operations (loading states, API calls) */
  NETWORK: 15000,
} as const;

export const SELECTORS = {
  /** Common button selectors */
  BUTTONS: {
    SUBMIT: '[data-testid*="submit"]',
    CANCEL: '[data-testid*="cancel"]',
    ADD: '[data-testid*="add"]',
    DELETE: '[data-testid*="delete"]',
  },

  /** Form field selectors */
  FORMS: {
    INPUT: 'input',
    TEXTAREA: 'textarea',
    SELECT: 'select',
  },
} as const;

export const TEST_IDS = {
  ROOMS: {
    ADD_BUTTON: 'add-rooms-button',
    SUBMIT_BUTTON: 'room-form-submit-button',
    NAME_INPUT: 'room-name',
  },
  IDEAS: {
    CREATE_BUTTON: 'create-idea-button',
    CARD: 'idea-card',
  },
  USERS: {
    TABLE: 'users-table',
    FIELD: 'users-field',
  },
} as const;

export const WAIT_STATES = {
  NETWORK_IDLE: 'networkidle',
  DOM_CONTENT_LOADED: 'domcontentloaded',
  LOAD: 'load',
} as const;

export const RETRY_CONFIG = {
  /** Number of retries for flaky operations */
  RETRIES: 3,

  /** Delay between retries in ms */
  RETRY_DELAY: 1000,
} as const;
