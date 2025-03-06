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
- Manages Auth0 integration for authentication

### PrivateRoutes.tsx

Manages routes for authenticated users, including:

- Dashboard and welcome views
- Room and idea management
- Settings and configuration
- User profile and preferences
- Message and announcement systems

Key features:

- Role-based access control using checkPermissions
- Nested routing for complex views
- Automatic redirect for unauthorized access

### PublicRoutes.tsx

Handles unauthenticated user routes, including:

- Login and authentication
- Password recovery
- Instance code management
- OAuth integration
- Initial setup flows

## Route Structure

### Main Routes

- `/`: Welcome view/dashboard
- `/about`: About page
- `/phase/:phase`: Ideas filtered by phase
- `/offline`: Offline mode view
- `/updates`: System updates information

### Room-Related Routes

- `/room/:room_id/phase/:phase`: Room view filtered by phase
- `/room/:room_id/phase/:phase/idea/:idea_id`: Single idea view within a room
- `/room/:room_id/phase/:phase/idea-box/:box_id`: Ideas box view
- `/room/:room_id/phase/:phase/idea-box/:box_id/idea/:idea_id`: Single idea within a box

### Message System Routes

- `/announcements`: List of announcements
- `/announcements/:announcement_id`: Single announcement view
- `/messages`: List of messages
- `/messages/:message_id`: Single message view
- `/reports`: List of reports
- `/reports/:report_id`: Single report view
- `/requests`: List of requests
- `/requests/:report_id`: Single request view

### Settings Routes

- `/settings/profile`: User profile management
- `/settings/announcements`: Announcement management
- `/settings/boxes`: Box management
- `/settings/configuration`: System configuration
- `/settings/ideas`: Idea management
- `/settings/reports`: Report management
- `/settings/requests`: Request management
- `/settings/rooms`: Room management
- `/settings/users`: User management

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
