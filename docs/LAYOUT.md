# Aula Frontend Layout System

This document provides an overview of the layout system used in the Aula Frontend project. The layout system is responsible for the overall structure and arrangement of the application's user interface.

## Table of Contents

- [Overview](#overview)
- [Layout Components](#layout-components)
- [Configuration](#configuration)
- [Features](#features)

## Overview

The layout system provides two main layouts:

- **Public Layout**: Used for unauthenticated users (login, signup pages)
- **Private Layout**: Used for authenticated users (main application interface)

The system automatically switches between these layouts based on the user's authentication status.

## Layout Components

### Layout.tsx

The root layout component that:

- Determines which layout to use based on authentication status
- Renders either PrivateLayout or PublicLayout
- Includes global PopupMessages component

### PrivateLayout.tsx

The authenticated user interface that provides:

- Top navigation bar
- Side navigation bar
- Content area
- Support for mobile and desktop views
- Online/Offline state handling
- Temporary password update handling
- Bug/Report submission functionality
- Error boundary protection

Key features:

- Responsive design with mobile detection
- Dynamic title updates
- Online status checking
- Temporary password flow
- Error boundary protection for content

### PublicLayout.tsx

The unauthenticated user interface that provides:

- Language switcher
- Logo display
- Simple navigation
- Clean, focused interface for authentication

Key features:

- Centered content layout
- Language switching support
- Dynamic back-to-signin navigation
- Error boundary protection

## Configuration

Located in `config.ts`, defines key layout constants and configurations:

### Sidebar Configuration

```typescript
export const SIDEBAR_MOBILE_ANCHOR = 'right';
export const SIDEBAR_DESKTOP_ANCHOR = 'right';
export const SIDEBAR_WIDTH = '240px';
```

### Navigation Items

The sidebar includes navigation items for:

- Home (role: 10+)
- Profile (role: 20+)
- Users Management (role: 50+)
- Rooms Management (role: 50+)
- Boxes Management (role: 30+)
- Ideas Management (role: 30+)
- Messages Management (role: 50+)
- Announcements (role: 50+)
- Reports (role: 50+)
- Requests (role: 50+)
- Configuration (role: 50+)
- About (role: 10+)

### TopBar Configuration

```typescript
export const TOPBAR_MOBILE_HEIGHT = '56px';
export const TOPBAR_DESKTOP_HEIGHT = '64px';
```

### BottomBar Configuration

```typescript
export const BOTTOMBAR_DESKTOP_VISIBLE = false;
```

## Features

### Responsive Design

- Adapts to mobile and desktop viewports
- Configurable sidebar anchoring
- Dynamic height adjustments
- Mobile-optimized navigation

### Authentication-based Routing

- Automatic layout switching based on auth status
- Protected routes for authenticated users
- Public routes for unauthenticated users

### Navigation System

- Role-based menu items
- Hierarchical navigation structure
- Quick access to key features
- Mobile-friendly navigation patterns

### Error Handling

- Error boundaries for content protection
- Offline state detection and handling
- Error reporting functionality
- User feedback system

### Customization

- Theme support
- Language switching
- Configurable navigation items
- Adjustable layout dimensions

### User Experience

- Popup message system
- Loading state handling
- Smooth transitions
- Consistent spacing and alignment

## Usage Guidelines

1. Import layout components from their index files
2. Use the appropriate layout for your route type
3. Follow the established navigation patterns
4. Handle errors appropriately
5. Consider mobile and desktop views

## Contributing

When modifying the layout system:

1. Follow the existing component structure
2. Maintain responsive design principles
3. Consider both authenticated and unauthenticated states
4. Update configuration as needed
5. Document changes in this file
6. Test on both mobile and desktop viewports

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
