# Aula Frontend Documentation

Welcome to the Aula Frontend documentation. This guide provides comprehensive information about the architecture, components, and development practices used in the Aula Frontend project.

## Table of Contents

- [Getting Started](GETSTARTED.md)
- [Project Structure](STRUCTURE.md)
- [Components](COMPONENTS.md)
- [Views](VIEWS.md)
- [Layout](LAYOUT.md)
- [Routes](ROUTES.md)
- [Hooks](HOOKS.md)
- [Store](STORE.md)
- [Data](DATA.md)
- [Services & Utilities](UTILS.md)
- [Types](TYPES.md)
- [Theme](THEME.md)
- [Locale](LOCALE.md)

## Recent Updates

The documentation has been updated to reflect the current state of the codebase, with particular focus on:

- **Service Architecture**: API communication now uses a dedicated services layer
- **Component Structure**: Updated components documentation including DataForms and DataFields
- **Permissions System**: Comprehensive documentation of the role-based permission system
- **Alert System**: New documentation on the alert utilities
- **Mobile Development**: Added information about Capacitor integration
- **Type System**: Enhanced type documentation for requests and data tables

## Quick Navigation

### Development Setup

- [Installation Instructions](GETSTARTED.md#installation)
- [Available Scripts](GETSTARTED.md#available-scripts)
- [Environment Configuration](GETSTARTED.md#environment-configuration)
- [Mobile Development](GETSTARTED.md#mobile-development)
- [Deployment Process](GETSTARTED.md#deployment)

### Architecture

- [Project Structure Overview](STRUCTURE.md)
- [Data Architecture](DATA.md#data-architecture)
- [Service Structure](UTILS.md#service-structure)
- [Component Organization](COMPONENTS.md#usage-guidelines)

### Core Features

- [Component System](COMPONENTS.md)
- [ScopeHeader Component](SCOPE-HEADER.md)
- [Data Forms & Fields](COMPONENTS.md#data-components)
- [Permissions System](UTILS.md#permission-system)
- [State Management](STORE.md#store-state)
- [Notification System](STORE.md#popuptype)
- [Routing System](ROUTES.md)

### Reference

- [Role Types & Permissions](UTILS.md#role-types)
- [API Services](UTILS.md#service-structure)
- [TypeScript Types](TYPES.md)
- [Utility Functions](UTILS.md)
- [Custom Hooks](HOOKS.md)
- [Theming System](THEME.md)
- [Internationalization](LOCALE.md)

## Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── layout/            # Layout components
├── locale/            # Language definitions
├── routes/            # Route definitions
├── services/          # API service modules
├── store/             # State management
├── theme/             # Theme configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── views/             # Page components
```

## Documentation Files

- [GETSTARTED.md](GETSTARTED.md) - Setup and development instructions
- [COMPONENTS.md](COMPONENTS.md) - Reusable UI components
- [SCOPE-HEADER.md](SCOPE-HEADER.md) - ScopeHeader component documentation
- [DATA.md](DATA.md) - Data architecture and handling
- [HOOKS.md](HOOKS.md) - Custom React hooks
- [LAYOUT.md](LAYOUT.md) - Layout system and components
- [LOCALE.md](LOCALE.md) - Internationalization
- [ROUTES.md](ROUTES.md) - Routing system
- [STORE.md](STORE.md) - State management
- [STRUCTURE.md](STRUCTURE.md) - Project structure
- [THEME.md](THEME.md) - Theming system
- [TYPES.md](TYPES.md) - TypeScript types and interfaces
- [UTILS.md](UTILS.md) - Utilities and services
- [VIEWS.md](VIEWS.md) - Page components

## Contributing

### License
By contributing to this project, you agree that your contributions will be licensed under the European Union Public License (EUPL) 1.2 or later. You can find the full text of the license [here](https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12).

### Development Process

- Follow the established code style and patterns
- Use TypeScript for all new code
- Ensure proper documentation of components and functions
- Run tests and linting before submitting changes

### Code Style

The project follows specific code style guidelines:

- TypeScript with strict type checking
- PascalCase for components and component folders
- camelCase for variables, functions, and hooks
- Component files structure: ComponentName/ComponentName.tsx

### Permissions System

When implementing features that require permissions:

- Use the `checkPermissions` utility from utils/permissions.ts
- Follow the established pattern for permission checks
- Refer to the [Role Types documentation](UTILS.md#role-types) for details

## Contact

For questions or assistance, please contact the Aula development team at `dev [at] aula.de` or open an issue in the project repository.

Thank you for using Aula Frontend documentation! 🎉
