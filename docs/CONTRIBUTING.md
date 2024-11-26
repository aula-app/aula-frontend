# Contributing to Aula Frontend

Thank you for your interest in contributing to Aula Frontend! This document provides guidelines and instructions for contributing to our project.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Code of Conduct](#code-of-conduct)

## Project Overview

Aula Frontend is a React-based web application built with TypeScript and Vite. The project uses modern web technologies and follows best practices for frontend development.

### Key Technologies

- React
- TypeScript
- Vite
- Capacitor (for mobile support)
- i18n (for internationalization)

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aula-frontend.git
   cd aula-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file:
   ```bash
   cp .env.sample .env
   ```

## Development Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. For mobile development:
   ```bash
   npm run build
   npx cap sync
   ```

## Project Structure

```
├── src/
│   ├── [components/](COMPONENTS.md)     # Reusable React components
│   ├── [hooks/](HOOKS.md)         # Custom React hooks
│   ├── [layout/](LAYOUT.md)       # Layout components
│   ├── [locale/](LOCALE.md)       # Layout components
│   ├── [routes/](ROUTES.md)       # Route definitions
│   ├── [store/](STORE.md)         # State management
│   ├── [theme/](THEME.md)         # Theme configuration
│   ├── [types/](TYPES.md)         # TypeScript type definitions
│   ├── [utils/](UTILS.md)         # Utility functions
│   └── [views/](VIEWS.md)         # Page components
├── public/            # Static assets
└── android/          # Mobile platform specific code
```

## Contributing Guidelines

### Before You Start

1. Check existing issues and pull requests
2. For major changes, open an issue first to discuss your proposal

### Development Process

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

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Enforcement

Violations of the code of conduct may result in temporary or permanent restrictions.

---

## Questions or Need Help?

Feel free to open an issue for:

- Bug reports
- Feature requests
- Documentation improvements
- General questions

Thank you for contributing to Aula Frontend! 🎉
