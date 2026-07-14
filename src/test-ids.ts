/**
 * Shared test ID constants used by both app components and Playwright tests.
 *
 * Import this file in React components (data-testid={TEST_IDS.FOO}) and in
 * Playwright interactions (page.getByTestId(TEST_IDS.FOO)) so that any rename
 * is caught at compile time in both places instead of silently breaking tests.
 */
export const TEST_IDS = {
  // Bug reporting (BugButton, BugForms)
  REPORT_BUG_BUTTON: 'report-bug-button',
  BUG_DIALOG: 'bug-dialog',
  BUG_FORM_SUBMIT: 'bug-form-submit-button',

  // Content reporting (ReportButton)
  REPORT_DIALOG: 'report-dialog',

  // Search & sort (ScopeHeader)
  SEARCH_FIELD: 'search-field',
  SEARCH_BUTTON: 'search-button',
  SORT_SELECT: 'sort-select',
  SORT_BUTTON: 'sort-button',
  SORT_DIRECTION_BUTTON: 'sort-direction-button',

  // Filtering (FilterBar)
  FILTER_TOGGLE_BUTTON: 'filter-toggle-button',

  // Cards
  ROOM_CARD: 'room-card',
  BOX_CARD: 'box-card',

  // Dialogs / confirmations (ConfirmDialog, DataDelete)
  CONFIRM_BUTTON: 'confirm-button',
  CANCEL_BUTTON: 'cancel-button',
  DELETE_BUTTON: 'delete-button',

  // Idea card actions (v2 Idea, Edit/Delete/ReportIdeaButton)
  ADD_IDEA_BUTTON: 'add-idea-button',
  IDEA_MORE_MENU: 'idea-more-menu',
  IDEA_MORE_OPTIONS_PANEL: 'idea-more-options-panel',
  LIKE_BUTTON: 'like-button',
  EDIT_BUTTON: 'edit-button',
  REPORT_BUTTON: 'report-button',
  SHARE_BUTTON: 'share-button',
  DELETE_IDEA_CONFIRM: 'delete-idea-confirm',
  DELETE_IDEA_CANCEL: 'delete-idea-cancel',

  // Offline state (PublicOfflineView)
  SCHOOL_OFFLINE_VIEW: 'school-offline-view',

  // Reports (ReportCard)
  ARCHIVE_REPORT_BUTTON: 'archive-report-button',

  // Toast notifications (Toast)
  TOAST_ERROR: 'toast-error',
  TOAST_SUCCESS: 'toast-success',
  TOAST_WARNING: 'toast-warning',
  TOAST_INFO: 'toast-info',

  // Navigation layout (TopBar, SideBar, Breadcrumb, PrintButton)
  TOPBAR_MENU_BUTTON: 'topbar-menu-button',
  BREADCRUMB_NAV: 'breadcrumb-nav',
  BREADCRUMB_TOGGLE: 'breadcrumb-toggle',
  BREADCRUMB_MENU: 'breadcrumb-menu',
  PRINT_BUTTON: 'print-button',
} as const;

export type TestId = (typeof TEST_IDS)[keyof typeof TEST_IDS];
