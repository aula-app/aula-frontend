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
- [Alert Utilities](#alert-utilities)
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

The application now uses a services architecture for API communication:

### Service Structure

Located in `src/services/`, this architecture separates API requests by domain:

- `announcements.ts`: Announcement management
- `auth.ts`: Authentication operations
- `boxes.ts`: Box CRUD operations
- `categories.ts`: Category management
- `comments.ts`: Comment functionality
- `groups.ts`: User group operations
- `ideas.ts`: Idea management
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

Located in `src/services/requests.ts` (moved from utils), provides the foundation for API communication:

- Makes authenticated requests to the backend
- Handles JWT token management and authentication
- Implements error handling and offline detection
- Supports automatic user ID inclusion in requests

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

#### Permission Structure

The permissions are defined as a nested object with the following structure:
```typescript
const permissions = {
  [model]: {
    [action]: { 
      role: number | number[],  // Required role level or array of allowed roles
      self?: boolean            // Whether users can perform action on their own resources
    }
  }
}
```

#### Model Permissions

Permissions are organized by data models:

**Announcements**
- `create`: Create announcements (Admin)
- `edit`: Edit announcements (Admin)
- `delete`: Delete announcements (Admin)
- `viewAll`: View all announcements (Admin) 
- `status`: Change announcement status (Admin)

**Boxes**
- `addIdea`: Add ideas to boxes (Moderator+)
- `create`: Create boxes (Moderator+)
- `edit`: Edit boxes (Moderator+)
- `delete`: Delete boxes (Moderator+)
- `status`: Change box status (Moderator+)
- `viewAll`: View all boxes (Super Moderator+)
- `changePhase`: Change box phase (Moderator+)
- `changePhaseDuration`: Change phase duration (Moderator+)

**Categories**
- `create`: Create categories (Admin)
- `edit`: Edit categories (Admin)
- `delete`: Delete categories (Admin)
- `status`: Change category status (Super Moderator+)

**Comments**
- `create`: Create comments (All users)
- `edit`: Edit comments (All users, self only)
- `delete`: Delete comments (Moderator+, self)
- `status`: Change comment status (Super Moderator+)

**Groups**
- `addIdea`: Add ideas to groups (Super Moderator+)
- `create`: Create groups (Admin)
- `edit`: Edit groups (Admin)
- `delete`: Delete groups (Admin)
- `status`: Change group status (Admin)

**Ideas**
- `addCategory`: Add categories to ideas (User+)
- `create`: Create ideas (All users and admin)
- `edit`: Edit ideas (Moderator+, self)
- `delete`: Delete ideas (Moderator+, self)
- `like`: Like ideas (All users and admin)
- `vote`: Vote on ideas (All users and admin)
- `approve`: Approve ideas (Principal)
- `setWinner`: Mark ideas as winners (Moderator+)
- `viewAll`: View all ideas (Super Moderator+)
- `status`: Change idea status (Super Moderator+)

**Messages**
- `viewAll`: View all messages (Super Moderator+)
- `status`: Change message status (Admin)

**Reports**
- `viewAll`: View all reports (Super Moderator+, Principal+, Admin)
- `status`: Change report status (Admin)

**Requests**
- `viewAll`: View all requests (Admin)
- `status`: Change request status (Admin)

**Rooms**
- `addUser`: Add users to rooms (Admin)
- `addBox`: Add boxes to rooms (Super Moderator+)
- `create`: Create rooms (Admin)
- `edit`: Edit rooms (Super Moderator+)
- `delete`: Delete rooms (Admin)
- `viewAll`: View all rooms (Super Moderator+)
- `status`: Change room status (Admin)

**Surveys**
- `create`: Create surveys (Moderator+)

**System**
- `profile`: Access user profile (User+)
- `access`: System access settings (Admin)
- `edit`: Edit system settings (Super Moderator+)
- `hide`: Hide system features (Tech Admin)

**Users**
- `addRole`: Assign roles to users (Admin)
- `createAdmin`: Create admin users (Admin)
- `create`: Create users (Admin)
- `edit`: Edit users (Admin)
- `delete`: Delete users (Admin)
- `viewAll`: View all users (Admin)
- `status`: Change user status (Admin)

### checkPermissions

Located in `src/utils/permissions.ts`, this function verifies if the current user has sufficient permissions:

```typescript
function checkPermissions(model: string, action: string, user_id?: string): boolean
```

**Parameters:**
- `model`: The data model to check permissions for (e.g., 'ideas', 'rooms')
- `action`: The action to check (e.g., 'create', 'edit', 'delete')
- `user_id` (optional): Used for "self" permission checks

**Returns:**
- `boolean`: Whether the user has permission

**Behavior:**
1. Gets the current user from JWT token in localStorage
2. Verifies that the action exists for the model
3. Handles permissions in room context:
   - Checks user's role within the specific room
   - Respects "self" permissions for user's own resources
4. Handles global permissions:
   - Compares user level against required role level
   - Supports both numeric role levels and arrays of permitted roles
5. Returns boolean indicating if user has permission

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
function successAlert(message: string, dispatch: Dispatch<any>): void
```

Displays a success notification to the user:
- Uses the application's central notification system
- Integrates with the AppStore through dispatch
- Shows a positive message with success styling

**Usage:**
```typescript
import { successAlert } from '@/utils';
import { useAppStore } from '@/store';

const { dispatch } = useAppStore();
successAlert('Item successfully created', dispatch);
```

### errorAlert

```typescript
function errorAlert(message: string, dispatch: Dispatch<any>): void
```

Displays an error notification to the user:
- Highlights issues or problems
- Uses error styling for emphasis
- Integrates with the AppStore through dispatch

**Usage:**
```typescript
import { errorAlert } from '@/utils';
import { useAppStore } from '@/store';

const { dispatch } = useAppStore();
errorAlert('Failed to save changes', dispatch);
```

### infoAlert

```typescript
function infoAlert(message: string, dispatch: Dispatch<any>): void
```

Displays an informational notification:
- Provides general information to the user
- Uses success styling (AppStore limitation)
- Non-critical messaging

### warningAlert

```typescript
function warningAlert(message: string, dispatch: Dispatch<any>): void
```

Displays a warning notification:
- Alerts users to potential issues
- Uses error styling (AppStore limitation)
- Intended for cautionary messages

**Implementation Note:**
The current AppStore only supports 'success' and 'error' notification types, so infoAlert uses success styling and warningAlert uses error styling.

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
