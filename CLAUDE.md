# CLAUDE.md - Aula Frontend Development Guide

## Build & Development Commands
- Start dev server: `yarn dev` or `yarn start`
- Check types: `yarn check-type` or `yarn type`
- Lint code: `yarn lint`
- Format code: `yarn format` (src only) or `yarn format:all` (all files)
- Build: `yarn build` (production), `yarn build-devel`, `yarn build-staging`, `yarn build-test`

## Code Style Guidelines
- **TypeScript**: Strict type checking enabled (no any unless necessary)
- **Components**: PascalCase for components, folders as ComponentName/ComponentName.tsx
- **Variables/Functions**: camelCase for variables, functions, hooks
- **Imports**: Group in order: React, libraries, components, hooks, utils, types, styles
- **Formatting**: 2-space indentation, max 120 chars per line
- **Error Handling**: Use try/catch with specific error messages
- **Forms**: Use react-hook-form for form handling with yup validation
- **State Management**: Prefer React hooks (useState, useContext) for state
- **Path Aliasing**: Use @/ for imports from src directory

## Project Structure
- components/: UI components (reusable)
- hooks/: Custom React hooks
- views/: Page components
- services/: API services
- utils/: Utility functions
- types/: TypeScript interfaces/types
- theme/: MUI theme configuration