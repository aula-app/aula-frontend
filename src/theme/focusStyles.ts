/**
 * Defines consistent focus styles to be used across the application
 * This enhances keyboard navigation by providing visible focus indicators
 */

const focusVisibleStyles = {
  // Outline on focus that works across different background colors
  // Uses a double outline for better visibility - a white/dark inner line and a colored outer line
  outline: '2px solid',
  outlineOffset: 2,
  boxShadow: '0 0 0 4px rgba(134, 200, 157, 0.3)',
  transition: 'outline-color 0.2s, box-shadow 0.2s',
};

// Different focus styles for light and dark modes
const lightModeFocusStyles = {
  ...focusVisibleStyles,
  outlineColor: 'hsl(134, 72%, 67%)', // primary.main from light theme
};

const darkModeFocusStyles = {
  ...focusVisibleStyles,
  outlineColor: 'hsl(134, 20%, 40%)', // primary.main from dark theme
};

// Helper function to get the correct focus styles based on theme mode
const getFocusStyles = (isDarkMode: boolean) => 
  isDarkMode ? darkModeFocusStyles : lightModeFocusStyles;

// Component-specific overrides
const buttonFocusStyles = {
  ...focusVisibleStyles,
  outline: '3px solid',
  outlineOffset: 3,
};

const tableCellFocusStyles = {
  ...focusVisibleStyles,
  outlineOffset: 0,
};

const linkFocusStyles = {
  ...focusVisibleStyles,
  textDecoration: 'underline',
};

export default getFocusStyles;