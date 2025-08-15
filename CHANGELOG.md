## 1.4.0

- **New features:**
  - Added comprehensive ScopeHeader component with search and sort functionality for improved data navigation
  - Implemented unified filtering system with `useSearchAndSort` and `useFilteredData` hooks for consistent UI patterns
  - Added smart default sort selection that automatically uses the first available sort option
  - Enhanced rooms view with sortable columns including room name, creation date, last update, and importance
- **UX improvements:**
  - Improved accessibility with proper ARIA roles, labels, and keyboard navigation for search and sort controls
  - Added horizontal collapse animations for search and sort panels with click-outside detection
  - Implemented proper focus management and screen reader support for filtering interfaces
  - Enhanced visual feedback with dynamic button states and proper loading indicators
  - Added offline page to inform users when the instance is unavailable
  - Added confirmation button for instance status changes to prevent accidental offline mode
  - Implemented form data persistence using sessionStorage to prevent data loss during navigation
  - Enhanced form validation and error handling across all data forms
- **Technical improvements:**
  - Created reusable filter functions (`createTextFilter`, `createStatusFilter`, `createRoomTypeFilter`) for common filtering patterns
  - Consolidated filtering, searching, and sorting logic into well-organized, type-safe hooks
  - Added comprehensive TypeScript interfaces and documentation for better developer experience
  - Optimized hook architecture for better performance and code reusability
  - Improved ESLint configuration with separate TypeScript config for test files
  - Enhanced Playwright test structure with proper assertions and dynamic user handling
  - Better error handling and loading states in UserField component
- **Bug fixes:**
  - Fixed broken message forms that were preventing proper submission
  - Display error messages when creation and edit requests fail
  - Prevent dialogs from closing on unsuccessful requests to allow error correction
  - Fixed name change requests not working properly
  - Fixed UserField component accessibility issues with label-input associations
  - Resolved draft storage incorrectly saving data for existing records during edits
  - Fixed Playwright test import errors and ESLint configuration issues
  - Fixed markdown rendering in data tables by removing line breaks for proper display

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
