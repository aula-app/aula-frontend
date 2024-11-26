# Aula Frontend Store

This document provides an overview of the global state management system used in the Aula Frontend project. The store is implemented using React's Context API with a Redux-like pattern.

## Overview

The store system consists of three main files:

- `AppStore.tsx`: Defines the store provider and hooks
- `AppReducer.ts`: Contains the state update logic
- `index.tsx`: Exports the store components

## Store State

The global state includes the following properties:

```typescript
interface AppStoreState {
  darkMode: boolean; // Theme preference
  isAuthenticated: boolean; // Authentication status
  hasConsent: boolean; // User consent status
  currentUser?: object; // Current user data
  messages: PopupType[]; // System notifications
}
```

## Usage Methods

The store can be accessed in three ways:

### 1. Functional Components (Hook)

```typescript
import { useAppStore } from '@/store';

const MyComponent = () => {
  const [state, dispatch] = useAppStore();
  // Use state and dispatch as needed
};
```

### 2. Class Components (HOC)

```typescript
import { withAppStore } from '@/store';

class MyComponent extends React.Component {
  // Access store through this.props.store
}

export default withAppStore(MyComponent);
```

### 3. Direct Context Usage

```typescript
import { AppContext } from '@/store';

const MyComponent = () => {
  const [state, dispatch] = useContext(AppContext);
  // Use state and dispatch as needed
};
```

## Available Actions

The store supports the following actions:

### Authentication

- `CURRENT_USER`: Updates current user data
- `LOG_IN`: Sets authenticated state to true
- `LOG_OUT`: Sets authenticated state to false and clears user data

### User Preferences

- `DARK_MODE`: Toggles dark/light theme
- `HAS_CONSENT`: Updates user consent status

### Notifications

- `ADD_POPUP`: Adds a new popup message
- `REMOVE_POPUP`: Removes a specific popup message
- `REMOVE_ALL_POPUP`: Clears all popup messages

Popup Types:

- `success`
- `error`

Usage:

```typescript
import { AppStore } from '@/store';
const [state, dispatch] = useAppStore();

dispatch({ type: 'ADD_POPUP', message: { message: t('texts.forgotRequest'), type: 'success' } });
dispatch({ type: 'REMOVE_POPUP', index }); // index being the index of the selected message in the 'state.messages' array
dispatch({ type: 'REMOVE_ALL_POPUP' });
```

## Store Provider

The store must be initialized at the application root:

```typescript
import { AppStore } from '@/store';

const App = () => (
  <AppStore>
    <YourApp />
  </AppStore>
);
```

## Features

- Persists dark mode preference in localStorage
- Automatically detects system dark mode preference
- Prevents duplicate popup messages
- Maintains authentication state across page reloads
- Type-safe implementation with TypeScript

## Best Practices

1. Use the `useAppStore` hook in functional components whenever possible
2. Dispatch actions with proper type and payload structure
3. Avoid storing large amounts of data in the global state
4. Use local state for component-specific data
5. Consider performance implications when updating global state frequently
