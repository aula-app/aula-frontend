## 1.3.1

- **Bug fixes:**
  - Display error message in case creation and edition unsuccessful requests
  - Prevent dialogs from closing on unsuccessful requests
  - Fixed name change requests
- **UX improvements:**
  - Added an offline page to inform instance offline status to users

## 1.3.0

- **UX improvements:**
  - Added ideas and boxes filters

- **Bug fixes:**
  - Prevent duplicate user creation
  - Prevent likes on own ideas and comments
  - Remove google font calls
  - Fixed missing favicon
  - Fixed Announcements agree button missing text
  - Fixed name change requests

## 1.2.0

- **Accessibility improvements:**
  - Added comprehensive ARIA attributes, data-testid properties, and focus management across forms, dialogs, accordions, and navigational components
  - Enhanced keyboard navigation support and screen reader announcements using new accessibility utilities
  - Implemented skip navigation components for better accessibility compliance
  - Replaced legacy "data-testing-id" with standardized "data-testid" attributes
  - Refined error and helper text for improved user experience

- **Code cleanup and refactoring:**
  - Removed legacy and unused code to simplify codebase and improve maintainability
  - Converted exported constants and functions to local ones where unused externally
  - Deleted obsolete modules and functions
  - Switched re-exports to only default exports in view and component index files
  - Cleaned up translation files and synchronized German/English translations
  - Added missing translation keys and removed duplicates
  - Dockerized for easier self-hosting.

- **Bug fixes:**
  - Fixed announcement consent button display issues by making consent_text field required
  - Added fallback text (t('actions.agree')) when consent_text is missing
  - Updated Yup schema validation for announcement forms with proper defaults
  - Fixed PhaseDurationFields component initialization issues
  - Resolved async value handling in form components
  - Fixed ConsentField to source default values from form defaults instead of hardcoded translations

- **Test improvements:**
  - Added Playwright automated tests for better end-to-end testing coverage
  - Updated test selectors to use data-testid instead of role-based selectors
  - Improved test reliability and maintainability across the test suite
