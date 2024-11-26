# Aula Frontend Hooks

This document provides an overview of all custom hooks used in the Aula Frontend project. These hooks encapsulate common functionality and provide reusable logic across components.

## Table of Contents

- [Authentication Hooks](#authentication-hooks)
- [Layout Hooks](#layout-hooks)
- [Event Hooks](#event-hooks)
- [Form Hooks](#form-hooks)
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
