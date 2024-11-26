# Aula Frontend Types

This document provides an overview of the TypeScript type definitions used in the Aula Frontend project.

## Type Modules

### Delegation.ts

Contains types for the vote delegation system, defining the structure for how votes can be delegated between users within rooms and topics.

### Generics.ts

Houses common utility types used throughout the application, including:

- Database response structures
- Color and status enums
- Configuration interfaces
- Online/offline state definitions

### GroupTypes.ts

Defines the structure for user groups within the system, including properties for group management and permissions.

### PageLinks.ts

Contains types for navigation elements, defining the structure of sidebar links and navigation items with their associated icons and permissions.

### RequestTypes.ts

Defines types for API communication:

- Request/response structures
- Status request definitions
- Configuration request formats
- Error handling types

### Scopes.ts

Contains core data structure types, including the socpe specific return types, for main features:

- Announcements
- Topic boxes
- Ideas and comments
- Messages and reports
- Rooms and users
- Categories

### SettingsTypes.ts

Defines configuration and settings-related types:

- Room phases (wild, discussion, approval, voting, results)
- User roles and permissions
- Field configurations
- Custom field definitions

### TableTypes.ts

Contains types for data table implementations:

- Table configuration options
- Row and column definitions
- Response formats for tabular data

## Usage Guidelines

1. Import types from their respective modules
2. Use TypeScript's type system for type safety
3. Follow established naming conventions
4. Document new types in this file

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
