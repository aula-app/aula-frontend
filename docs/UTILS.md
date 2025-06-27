# Aula Frontend Utilities

This document provides an overview of all utility functions used in the Aula Frontend project. Utilities are organized by category for easier reference.

## Table of Contents

- [Authentication](#authentication)
- [Storage Management](#storage-management)
- [Phase Management](#phase-management)
- [API Requests](#api-requests)
- [Role Management](#role-management)
- [Alert Utilities](#alert-utilities)
- [General Utilities](#general-utilities)
- [Vote Handling](#vote-handling)
- [Command Handling](#command-handling)
- [Accessibility](#accessibility)

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

### Language-Specific Functions

For formatting with explicit language control:

- `getDisplayDateForLanguage(date, language)`: Format datetime for specific language
- `getDisplayDateOnlyForLanguage(date, language)`: Format date-only for specific language
- `getDateFormatForLanguage(language, type)`: Get format string for specific language
- `getDisplayDateOnly(date)`: Format date-only using current language

### Date Format Constants

- `DEFAULT_FORMAT_DATE_TIME`: 'YYYY-MM-DD HH:mm:ss' (fallback format)
- `DEFAULT_FORMAT_DATE_ONLY`: 'YYYY-MM-DD' (fallback format)

### Locale Format Examples

| Language     | DateTime Input       | DateTime Output        | Date Only Output |
| ------------ | -------------------- | ---------------------- | ---------------- |
| English (en) | 2025-06-27T14:30:00Z | 06/27/2025 02:30:00 PM | 06/27/2025       |
| German (de)  | 2025-06-27T14:30:00Z | 27.06.2025 14:30:00    | 27.06.2025       |
| Default      | 2025-06-27T14:30:00Z | 2025-06-27 14:30:00    | 2025-06-27       |

**Note:** For React components, use the `useDateFormatters` hook documented in [HOOKS.md](./HOOKS.md) for reactive date formatting.

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

The application uses a services architecture for API communication:

### Service Structure

Located in `src/services/`, this architecture separates API requests by domain:

- `announcements.ts`: Announcement management
- `auth.ts`: Authentication operations
- `boxes.ts`: Box CRUD operations
- `categories.ts`: Category management
- `comments.ts`: Comment functionality
- `config.ts`: Configuration and settings
- `consent.ts`: User consent management
- `dashboard.ts`: Dashboard data
- `groups.ts`: User group operations
- `ideas.ts`: Idea management
- `instance.ts`: Instance validation
- `login.ts`: Login operations
- `media.ts`: Media upload/handling
- `messages.ts`: Messaging functionality
- `rooms.ts`: Room management
- `users.ts`: User account operations
- `vote.ts`: Voting functionality

Each service file:

- Exports typed functions for specific API operations
- Handles resource-specific error handling
- Uses the requests module for communication

### Core Request Module

Located in `src/services/requests.ts`, provides the foundation for API communication:

#### baseRequest

- Makes authenticated HTTP requests to the backend
- Handles JWT token management and authentication
- Implements automatic token refresh
- Supports both JSON and form data requests
- Handles offline mode detection
- Returns typed GenericResponse objects

#### databaseRequest

- Specialized wrapper for database API calls
- Automatically includes user ID in requests when specified
- Uses the model.php endpoint for database operations
- Supports automatic user context injection

#### Types

- `RequestObject`: Interface for database request structure
- `GenericResponse<T>`: Typed response interface
- `GenericListRequest`: Interface for list/pagination requests

## Role Management

Located in `src/utils/roles.ts` and `src/utils/permissions.ts`, defines user roles and permissions.

### Role Types

Defines user permission levels as defined in `src/types/SettingsTypes.ts`:

- 10: _Guest_ - Read-only access
- 20: _User_ - Basic participation (create ideas, comment, vote)
- 30: _Moderator_ - Can moderate assigned rooms (edit ideas, manage boxes)
- 31: _Moderator_V_ - Moderator with voting privileges
- 40: _Super Moderator_ - Can access and moderate any school's rooms
- 41: _Super Moderator_V_ - Super moderator with voting privileges
- 44: _Principal_ - Special role with approval rights
- 45: _Principal_V_ - Principal with voting privileges
- 50: _School Admin_ - Has access to admin settings (manage users, groups, categories)
- 60: _Tech Admin_ - Technical settings access only

### Permission System

Located in `src/utils/permissions.ts`, defines granular permissions for each data model and action.

#### checkPermissions

Verifies if the current user has sufficient permissions:

```typescript
function checkPermissions(model: string, action: string, user_id?: string): boolean;
```

**Parameters:**

- `model`: The data model to check permissions for (e.g., 'ideas', 'rooms')
- `action`: The action to check (e.g., 'create', 'edit', 'delete')
- `user_id` (optional): Used for "self" permission checks

**Returns:**

- `boolean`: Whether the user has permission

**Usage Example:**

```typescript
// Check if user can edit an idea
const canEditIdea = checkPermissions('ideas', 'edit', ideaOwnerId);

// Check if user can create a room
const canCreateRoom = checkPermissions('rooms', 'create');

// Use in conditional rendering
{checkPermissions('boxes', 'create') && <CreateBoxButton />}
```

## Alert Utilities

Located in `src/utils/alerts.ts`, provides functions for displaying application alerts and notifications:

### successAlert

```typescript
function successAlert(message: string, dispatch: Dispatch<any>): void;
```

Displays a success notification to the user:

- Uses the application's central notification system
- Integrates with the AppStore through dispatch
- Shows a positive message with success styling

### errorAlert

```typescript
function errorAlert(message: string, dispatch: Dispatch<any>): void;
```

Displays an error notification to the user:

- Highlights issues or problems
- Uses error styling for emphasis
- Integrates with the AppStore through dispatch

**Usage:**

```typescript
import { successAlert, errorAlert } from '@/utils';
import { useAppStore } from '@/store';

const { dispatch } = useAppStore();
successAlert('Item successfully created', dispatch);
errorAlert('Failed to save changes', dispatch);
```

## General Utilities

Located in `src/utils/utils.ts`, provides general-purpose utilities:

### Environment Detection

- `IS_SERVER`: Detects server-side execution (typeof window === 'undefined')

### Application Information

- `getDataLimit()`: Calculates pagination limit based on window height

## Vote Handling

Located in `src/utils/votes.tsx`, defines voting options and components:

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

## Accessibility

Located in `src/utils/a11yModal.ts`, provides accessibility utilities:

### Modal Management

- Functions for managing accessible modal dialogs
- Ensures proper focus management and ARIA attributes

Located in `src/utils/accessibility.ts`, provides general accessibility helpers.

## Recently Removed Utilities

The following utilities were removed during recent cleanup to simplify the codebase:

### Removed Files

- `form.ts`: Form validation utilities (replaced by react-hook-form)
- `navigation.ts`: Navigation helpers (not actively used)
- `sessionStorage.ts`: Session storage utilities (not actively used)
- `style.ts`: Material-UI styling helpers (not actively used)

### Removed Functions

- Form validation helpers (formHasError, formGetError, useAppForm)
- Navigation utilities (disableBackNavigation, navigateTo)
- Session storage functions (sessionStorageGet, sessionStorageSet, sessionStorageDelete)
- Style utilities (paperStyle, formStyle, dialogStyles, etc.)
- Date utilities (dateToString, FORMAT_TIME_ONLY)
- Alert utilities (infoAlert, warningAlert)
- Environment detection (IS_BROWSER, IS_WEBWORKER)
- Version utilities (getCurrentVersion, getCurrentEnvironment)

### Dependencies Removed

- `validate.js`: Form validation library (replaced by yup + react-hook-form)

## Usage Guidelines

1. Import utilities from the main utils index: `import { utilityName } from '@/utils'`
2. Use TypeScript types provided by the utilities
3. Handle errors appropriately when using async utilities
4. Consider environment (server/browser) when using storage utilities
5. Use the service architecture for API calls rather than direct requests
6. Follow established patterns for permission checking
7. Use the alert system consistently for user notifications

## Contributing

When adding new utilities:

1. Follow the existing module structure
2. Include proper TypeScript types
3. Add error handling where appropriate
4. Document the utility in this file
5. Include usage examples where helpful
6. Add unit tests for new utilities
7. Consider if the functionality belongs in utils vs services vs components

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
