# Contributing to Aula Frontend

Thank you for your interest in contributing to Aula Frontend! This document provides guidelines and instructions for contributing to our project.

For setup instructions and project overview, please refer to our [README.md](../README.md).

## Table of Contents

- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Code of Conduct](#code-of-conduct)

## Project Structure

```
├── src/
│   ├── components/     # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── layout/       # Layout components
│   ├── locale/       # Layout components
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
