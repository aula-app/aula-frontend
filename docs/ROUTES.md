# Aula Frontend Routes

This document provides an overview of the routing system used in the Aula Frontend project. The routing system manages navigation and access control throughout the application.

## Overview

The routing system is split into three main components:

- Public Routes: For unauthenticated users
- Private Routes: For authenticated users
- Main Router: Handles authentication state and route switching

## Route Components

### Routes.tsx

The main router component that:

- Determines user authentication status
- Handles user consent checks
- Switches between public and private routes based on auth state

### PrivateRoutes.tsx

Manages routes for authenticated users, including:

- Dashboard and welcome views
- Room and idea management
- Settings and configuration
- User profile and preferences
- Message and announcement systems

Key features:

- Role-based access control
- Nested routing for complex views
- Automatic redirect for unauthorized access

### PublicRoutes.tsx

Handles unauthenticated user routes, including:

- Login and authentication
- Password recovery
- Instance code management
- OAuth integration
- Initial setup flows

## Usage Guidelines

1. Always use the router's built-in components for navigation
2. Implement proper access control using checkPermissions
3. Handle loading and error states appropriately
4. Use nested routes for related views
5. Maintain consistent URL patterns

## Contributing

When adding new routes:

1. Follow the existing route structure
2. Implement proper access controls
3. Add appropriate loading states
4. Include error boundaries
5. Update this documentation
6. Test navigation flows

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
