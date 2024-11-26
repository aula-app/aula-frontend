# Aula Frontend Theme System

This document provides an overview of the theming system used in the Aula Frontend project. The theme system is built on top of Material-UI (MUI) and provides consistent styling across the application.

## Overview

The theme system consists of several key components:

- Theme Provider
- Light Theme
- Dark Theme
- Font Configuration
- Color Palettes

## Theme Provider

Located in `src/theme/AppThemeProvider.tsx`, the `AppThemeProvider` component is responsible for:

- Wrapping the entire application with MUI's ThemeProvider
- Managing theme switching between light and dark modes
- Handling Emotion cache for CSS-in-JS styling
- Applying global styles through CssBaseline

Usage:

```tsx
<AppThemeProvider>
  <App />
</AppThemeProvider>
```

## Color Palettes

### Common Palette Colors

Both light and dark themes share these base color categories:

- **Primary**: Green hues (main color for key elements)
- **Secondary**: Gray hues (supporting color)
- **Error**: Red hues (error states)
- **Warning**: Amber hues (warning states)
- **Info**: Blue hues (informational states)
- **Success**: Green hues (success states)

### Phase Colors

The application uses specific colors for different phases:

- **Wild**: Blue hues
- **Discussion**: Purple hues
- **Approval**: Orange hues
- **Voting**: Amber hues
- **Results**: Green hues

Each phase color includes light, main, and dark variants.

### Other Colors

Additional color definitions for specific UI elements:

- **Comment**: Gray variants
- **Vote States**: For (green), Neutral (amber), Against (red)
- **Message Types**: Message (cyan), Announcement (purple), Alert (red)
- **System**: Bug (gray), Report (amber), Request (gray)

## Light Theme

Defined in `src/theme/light.ts`, the light theme provides:

- Light background colors
- Higher contrast text
- Lighter variants of the color palette
- Brighter phase colors

## Dark Theme

Defined in `src/theme/dark.ts`, the dark theme provides:

- Dark background colors (using blueGrey)
- Appropriate text contrast
- Darker variants of the color palette
- Muted phase colors

## Font Configuration

Located in `src/theme/fonts.ts`, defines typography settings:

- Primary Font: Nunito Variable (headers and general text)
- Secondary Font: Open Sans Variable (body text)
- Font weights and styles for different typography variants

## Usage Guidelines

1. Access theme in components using MUI's useTheme hook:

   ```typescript
   import { useTheme } from '@mui/material';

   const MyComponent = () => {
     const theme = useTheme();
     // Use theme.palette, theme.typography, etc.
   };
   ```

2. Toggle dark mode using the global store:

   ```typescript
   const [state, dispatch] = useAppStore();
   dispatch({ type: 'DARK_MODE' });
   ```

3. Use theme colors consistently:

   - Primary color for main actions and key UI elements
   - Secondary color for supporting elements
   - Phase colors for phase-specific UI elements
   - Status colors (error, warning, etc.) for appropriate states

4. Follow typography hierarchy:
   - Use h1-h6 for headers
   - body1 for primary content
   - body2 for secondary content

## Contributing

When modifying the theme:

1. Ensure changes are consistent across both light and dark themes
2. Test color contrast for accessibility
3. Verify changes in both theme modes
4. Update this documentation if adding new theme properties
5. Consider the impact on existing components

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
