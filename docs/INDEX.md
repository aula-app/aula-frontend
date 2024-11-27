# Contributing to Aula

Thank you for your interest in contributing to Aula! This document provides guidelines and instructions for contributing to our project.

## Table of Contents

- [Project Structure](#project-structure)
  - [Detailed Documentation](#detailed-documentation)
- [Before You Start](#before-you-start)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup and Configuration](#database-setup-and-configuration)
  - [Environment Configuration](#environment-configuration)
  - [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Development Process](#development-process)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Questions or Need Help?](#questions-or-need-help)

## Project Structure

```
├── src/
│   ├── components/     # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── layout/       # Layout components
│   ├── locale/       # Language definitions
│   ├── routes/       # Route definitions
│   ├── store/        # State management
│   ├── theme/        # Theme configuration
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── views/        # Page components
├── public/            # Static assets
└── android/          # Mobile platform specific code
```

### Detailed Documentation

For detailed information about specific parts of the codebase, please refer to the following documentation:

- [Data Structure](DATA.md) - Details about reusable React

For detailed information about specific parts of the Project Structure, please refer to the following documentation:

- [Components Documentation](COMPONENTS.md) - Details about reusable React components
- [Hooks Documentation](HOOKS.md) - Information about custom React hooks
- [Layout Documentation](LAYOUT.md) - Layout system and components
- [Locale Documentation](LOCALE.md) - Internationalization setup and usage
- [Routes Documentation](ROUTES.md) - Routing system and configuration
- [Store Documentation](STORE.md) - State management implementation
- [Theme Documentation](THEME.md) - Theming system and customization
- [Types Documentation](TYPES.md) - TypeScript types and interfaces
- [Utils Documentation](UTILS.md) - Utility functions and helpers
- [Views Documentation](VIEWS.md) - Page components and views

## Before You Start

1. Check existing issues and pull requests
2. For major changes, open an issue first to discuss your proposal

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm (version 7 or higher recommended)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/aula-app/aula-frontend.git
   ```

2. Navigate to the project directory:

   ```
   cd aula-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Database Setup and Configuration

4. Set up aula's API Back End based on the [Aula's Backend Repository](https://github.com/aula-app/playground).

### Environment Configuration

5. Create a `.env` file based on the `.env.sample` file:

   ```
   cp .env.sample .env
   ```

6. Update the values in the `.env` file with your configuration:

   ```
   VITE_APP_VERSION = $npm_package_version
   VITE_APP_API_URL = http://localhost/
   VITE_APP_MULTI_AULA = https://m.aula.de/instances
   VITE_APP_MULTI = false
   ```

7. Start the development server:

   ```
   npm run dev
   ```

   The application will start in development mode. Open your browser to the URL shown in the terminal to view the app.

### Available Scripts

The following npm scripts are available:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the production-ready application
- `npm run build-devel`: Builds the application in development mode
- `npm run build-test`: Builds the application in test mode
- `npm run preview`: Preview the production build locally
- `npm run format`: Format source files using Prettier
- `npm run lint`: Lint source files using ESLint
- `npm run check`: Type check TypeScript files
- `npm run type`: Alias for TypeScript checking

## Deployment

To deploy the application:

1. Build the production-ready application:

   ```
   npm run build
   ```

2. The build output will be generated in the `dist/` directory. Deploy these files to your web server.

3. For proper routing to work, ensure your web server is configured to redirect all requests to `index.html`, as this is a single-page application.

   If using Nginx, you might add this to your server configuration:

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Development Process

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Write or update tests if necessary
4. Ensure all tests pass:
   ```bash
   npm run test
   ```
5. Format your code:
   ```bash
   npm run format
   ```
6. Run linting:
   ```bash
   npm run lint
   ```

## Code Style

We use ESLint and Prettier to maintain code quality. Our style guide is enforced through `.eslintrc.js` and `.prettierrc.js`.

Key points:

- Use TypeScript for all new code
- Follow the existing component structure
- Write meaningful commit messages
- Document new features or changes

## Submitting Changes

1. Push to your fork
2. Submit a Pull Request (PR)
3. In your PR description:
   - Reference any related issues
   - Describe your changes
   - Mention any breaking changes
4. Wait for review and address any feedback

## Questions or Need Help?

Feel free to open an issue for:

- Bug reports
- Feature requests
- Documentation improvements
- General questions

Thank you for contributing to Aula Frontend! 🎉
