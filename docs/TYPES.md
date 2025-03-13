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

Key types include:

```typescript
// Base response structure from API
export interface ResponseType<T = any> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

// Request configuration
export interface RequestConfigType {
  model: string;
  method: string;
  arguments: Record<string, any>;
}
```

These types are used throughout the service layer to ensure type safety in API communication.

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

Important table-related types include:

```typescript
// Column definition for data tables
export interface ColumnType {
  field: string;
  headerName: string;
  flex?: number;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  renderCell?: (params: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

// Data table props
export interface DataTableProps {
  columns: ColumnType[];
  rows: any[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (params: any) => void;
}
```

These types support the DataTable component and its various implementations throughout the application.

## Usage Guidelines

1. Import types from their respective modules
2. Use TypeScript's type system for type safety
3. Follow established naming conventions
4. Document new types in this file

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
