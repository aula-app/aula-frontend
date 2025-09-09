export const CATEGORY_CONSTANTS = {
  TEST_PREFIX: 'TESTING',
  TIMEOUTS: {
    DEFAULT: 10000,
    SHORT: 5000,
    WAIT: 1000,
    CREATE: 2000
  },
  SELECTORS: {
    CONFIG_ACCORDION_IDEA: 'config-accordion-idea',
    ADD_CATEGORY_BUTTON: 'add-new-category-chip',
    CATEGORY_FORM: 'category-forms',
    CATEGORY_NAME_INPUT: 'input[name="name"]',
    ICON_FIELD: 'icon-field-1',
    SUBMIT_BUTTON: '[data-testid="category-forms"] button[type="submit"]',
    DELETE_DIALOG: '[role="dialog"]',
    DELETE_CONFIRM_BUTTON: 'delete-cat-button',
    CANCEL_ICON: 'CancelIcon',
    DELETE_ICON: '.MuiChip-deleteIcon'
  },
  TEST_DATA: {
    ROOM_NAME_PREFIX: 'category-test',
    IDEA_NAME_PREFIX: 'with-category'
  }
} as const;