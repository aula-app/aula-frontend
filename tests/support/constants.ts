/**
 * Test constants and configuration values
 * Centralized location for all magic numbers and timeouts
 */

export const TIMEOUTS = {
  HALF_SECOND: 500,
  ONE_SECOND: 1000,
  THREE_SECONDS: 3000,
  FIVE_SECONDS: 5000,
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

export const RETRY_CONFIG = {
  /** Number of retries for flaky operations */
  RETRIES: 3,

  /** Delay between retries in ms */
  RETRY_DELAY: 1000,
} as const;
