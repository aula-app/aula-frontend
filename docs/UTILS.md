# Aula Frontend Utilities

This document provides an overview of all utility functions used in the Aula Frontend project. Utilities are organized by category for easier reference.

## Table of Contents

- [Data](#data)
- [Authentication](#authentication)
- [Storage Management](#storage-management)
- [Date Handling](#date-handling)
- [Form Utilities](#form-utilities)
- [Navigation](#navigation)
- [Phase Management](#phase-management)
- [API Requests](#api-requests)
- [Role Management](#role-management)
- [Styling Utilities](#styling-utilities)
- [General Utilities](#general-utilities)
- [Vote Handling](#vote-handling)
- [Command Handling](#command-handling)

## Data

Provides the configuration for data handling the data scopes, as described on the [Data Handling Documentation](DATA.md).

## Authentication

Located in `src/utils/jwt.ts`, provides JWT token handling:

### parseJwt

Parses and decodes a JWT token to extract its payload:

- Decodes base64-encoded JWT payload
- Returns user data including:
  - exp: Expiration timestamp
  - user_id: User's unique identifier
  - user_level: User's permission level
  - temp_pw: Optional flag for temporary password status

## Storage Management

### Local Storage

Located in `src/utils/localStorage.ts`, provides utilities for browser's localStorage:

#### localStorageGet

- Smartly reads values from localStorage
- Handles JSON parsing for complex data types
- Returns default value if key doesn't exist

#### localStorageSet

- Smartly writes values to localStorage
- Automatically stringifies objects
- Handles undefined values

#### localStorageDelete

- Deletes specific key from localStorage
- Can clear entire localStorage if no key specified

### Session Storage

Located in `src/utils/sessionStorage.ts`, provides similar utilities for sessionStorage:

#### sessionStorageGet

- Reads values from sessionStorage with smart parsing
- Returns default value if key doesn't exist

#### sessionStorageSet

- Writes values to sessionStorage
- Handles object serialization

#### sessionStorageDelete

- Removes items from sessionStorage
- Can clear entire sessionStorage

## Date Handling

Located in `src/utils/date.ts`, provides date formatting utilities:

### dateToString

- Converts dates to formatted strings
- Supports multiple format templates:
  - FORMAT_DATE_TIME (YYYY-MM-DD HH:mm:ss)
  - FORMAT_DATE_ONLY (YYYY-MM-DD)
  - FORMAT_TIME_ONLY (HH:mm:ss)
- Includes fallback handling for invalid dates

## Form Utilities

Located in `src/utils/form.ts`, provides form handling utilities:

### useAppForm

A comprehensive form management hook that provides:

- Form state management
- Validation handling
- Error tracking
- Field change handlers

### Form Constants

- SHARED_CONTROL_PROPS: Common props for form controls
- DEFAULT_FORM_STATE: Initial form state template

### Form Helper Functions

- formHasError: Checks if a field has errors
- formGetError: Gets error message for a field
- eventPreventDefault: Prevents default form submission

## Navigation

Located in `src/utils/navigation.ts`, provides navigation utilities:

### disableBackNavigation

- Disables browser's back button for current page
- Useful for preventing unwanted navigation

### navigateTo

- Programmatic navigation helper
- Supports push and replace state
- Handles both internal and external URLs

## Phase Management

Located in `src/utils/phases.ts`, manages voting phases:

### Phases

Defines voting phases with corresponding values:

- 0: Wild Ideas
- 10: Discussion
- 20: Approval
- 30: Voting
- 40: Results

## API Requests

Located in `src/utils/requests.ts`, handles API communication:

### databaseRequest

- Makes authenticated requests to the database API
- Handles JWT authentication
- Manages error handling
- Supports offline mode detection
- Automatically includes user ID in requests when needed

## Role Management

Located in `src/utils/roles.ts`, defines user roles:

### Roles

Defines user permission levels:

- 10: _Guest_ - Read only
- 20: _Student_ - Can comment and interact
- 30: _Moderator_ - Can moderate rooms in which they have been assigned to
- 40: _Super Moderator_ - Can access and moderate any school's rooms
- 50: _School Admin_ - Has access to admin settings
- 60: _Tech Admin_ - Technical settings access only

## Styling Utilities

Located in `src/utils/style.ts`, provides styling helpers:

### Style Functions

- paperStyle: Consistent Paper component styling
- formStyle: Form layout styling
- dialogStyles: Dialog component styling
- filledStylesByNames: Material UI color styles
- textStylesByNames: Text color styles
- buttonStylesByNames: Button styling with hover states

## General Utilities

Located in `src/utils/utils.ts`, provides general-purpose utilities:

### Environment Detection

- IS_SERVER: Detects server-side execution
- IS_BROWSER: Detects browser environment
- IS_WEBWORKER: Detects Web Worker context

### Application Information

- getCurrentVersion: Gets app version
- getCurrentEnvironment: Gets current environment

### User Utilities

- getCurrentUser: Gets current user ID
- checkPermissions: Verifies user permissions
- checkSelf: Validates user identity

## Vote Handling

Located in `src/utils/votes.tsx`, defines voting options:

### Vote Types

- -1: Against
- 0: Neutral
- 1: For

## Command Handling

Located in `src/utils/commands.ts`, manages command options:

### Status Options

- InstanceStatusOptions: System-wide status options
- ScopeStatusOptions: Scope-specific status options
- Commands: Command definitions for different scopes

## Usage Guidelines

1. Import utilities from their respective modules
2. Use TypeScript types provided by the utilities
3. Handle errors appropriately when using async utilities
4. Consider environment (server/browser) when using storage utilities
5. Follow the established patterns for form handling and validation

## Contributing

When adding new utilities:

1. Follow the existing module structure
2. Include proper TypeScript types
3. Add error handling where appropriate
4. Document the utility in this file
5. Include usage examples where helpful
6. Add unit tests for new utilities

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
