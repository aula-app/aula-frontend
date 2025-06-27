# Aula Frontend Hooks

This document provides an overview of all custom hooks used in the Aula Frontend project. These hooks encapsulate common functionality and provide reusable logic across components.

## Table of Contents

- [Authentication Hooks](#authentication-hooks)
- [Layout Hooks](#layout-hooks)
- [Event Hooks](#event-hooks)
- [Form Hooks](#form-hooks)
- [Date Hooks](#date-hooks)
- [Store Hooks](#store-hooks)

## Authentication Hooks

### useIsAuthenticated

A hook to detect if the current user is authenticated.

```typescript
const isAuthenticated = useIsAuthenticated();
```

Returns a boolean indicating whether the user is authenticated based on the presence of a token in local storage.

### useIsOnline

An asynchronous hook to check if the application is in online mode.

```typescript
const isOnline = await useIsOnline();
```

Returns a Promise that resolves to a boolean indicating whether the application is in online mode based on instance settings and user permissions.

### useEventLogout

A hook that returns an event handler for logging out the current user.

```typescript
const handleLogout = useEventLogout();
```

When called, the handler:

- Removes the authentication token from local storage
- Dispatches a logout action to the store
- Navigates to the home page

## Layout Hooks

### useOnMobile

A hook to detect if the application is being viewed on a mobile device using Media Query.

```typescript
const isMobile = useOnMobile();
```

Returns a boolean indicating whether the current viewport width is below the 'sm' breakpoint.

### useOnWideScreen

A hook to detect if the application is being viewed on a wide screen.

```typescript
const isWideScreen = useOnWideScreen();
```

Returns a boolean indicating whether the current viewport width is 'md' or larger.

### useOnMobileByTrackingWindowsResize

An alternative implementation of mobile detection using window resize events.

```typescript
const isMobile = useOnMobileByTrackingWindowsResize();
```

Returns a boolean indicating mobile status by tracking window resize events.

## Event Hooks

### useEventSwitchDarkMode

A hook that returns an event handler for toggling between dark and light modes.

```typescript
const handleThemeSwitch = useEventSwitchDarkMode();
```

When called, the handler toggles the darkMode state in the application store.

## Form Hooks

### useAppForm

A comprehensive form management hook that handles form state, validation, and error tracking.

```typescript
const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
  validationSchema: VALIDATION_SCHEMA,
  initialValues: INITIAL_VALUES,
});
```

Parameters:

- `validationSchema`: Object defining validation rules in 'validate.js' format
- `initialValues`: Optional object containing initial form values

Returns:

- `formState`: Current form state including values, errors, and validation status
- `setFormState`: Function to update form state
- `onFieldChange`: Event handler for form field changes
- `fieldGetError`: Function to get error message for a specific field
- `fieldHasError`: Function to check if a field has an error

## Date Hooks

### useDateFormatters

A hook that provides locale-aware date formatting functions based on the user's selected language.

```typescript
const { formatDateTime, formatDateOnly, getDateTimeFormat, getDateOnlyFormat } = useDateFormatters();
```

Returns an object with the following methods:

- `formatDateTime(date)`: Format full date and time in user's current locale
- `formatDateOnly(date)`: Format date only in user's current locale
- `getDateTimeFormat()`: Get current locale's datetime format string
- `getDateOnlyFormat()`: Get current locale's date-only format string

**Locale Support:**

- **English (en)**: MM/DD/YYYY hh:mm:ss A (US format with AM/PM)
- **German (de)**: DD.MM.YYYY HH:mm:ss (German format with 24-hour time)
- **Default**: YYYY-MM-DD HH:mm:ss (ISO format)

**Usage Example:**

```typescript
import { useDateFormatters } from '@/utils/date';

function EventCard({ event }) {
  const { formatDateTime, formatDateOnly } = useDateFormatters();

  return (
    <div>
      <h3>{event.title}</h3>
      <p>Start: {formatDateTime(event.startDate)}</p>
      <p>Date: {formatDateOnly(event.startDate)}</p>
    </div>
  );
}
```

**Format Examples:**

| Language     | Input: 2025-06-27T14:30:00Z | DateTime Output        | Date Only Output |
| ------------ | --------------------------- | ---------------------- | ---------------- |
| English (en) | 2025-06-27T14:30:00Z        | 06/27/2025 02:30:00 PM | 06/27/2025       |
| German (de)  | 2025-06-27T14:30:00Z        | 27.06.2025 14:30:00    | 27.06.2025       |
| Default      | 2025-06-27T14:30:00Z        | 2025-06-27 14:30:00    | 2025-06-27       |

## Store Hooks

### useAppStore

A hook to access the application's global store.

```typescript
const [state, dispatch] = useAppStore();
```

Returns:

- `state`: Current application state
- `dispatch`: Function to dispatch actions to update the store

## Usage Guidelines

1. Always import hooks from their respective modules rather than copying the implementation
2. Use hooks at the top level of your component
3. Follow the React Hooks rules and best practices
4. Consider performance implications when using hooks that track window events or perform heavy computations

## Contributing

When creating new hooks:

1. Follow the existing naming convention (use[HookName])
2. Include TypeScript types for parameters and return values
3. Add proper JSDoc documentation
4. Document the hook in this file
5. Include usage examples where appropriate
