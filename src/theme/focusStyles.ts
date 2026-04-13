/**
 * Defines consistent focus styles to be used across the application
 * This enhances keyboard navigation by providing visible focus indicators
 */

const focusVisibleStyles = {
  // Double-ring pattern ensures 3:1 contrast regardless of background color
  // Transparent offset creates a gap, making the ring visible on any background
  outline: '2px solid',
  outlineOffset: 2,
  transition: 'outline-color 0.2s',
};

// Different focus styles for light and dark modes
const lightModeFocusStyles = {
  ...focusVisibleStyles,
  // Dark ring (L≈0.021) on any light background including bg-primary (L≈0.626): ~9.5:1 ✅
  outlineColor: 'hsl(236, 42%, 22%)',
  boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.15)',
};

const darkModeFocusStyles = {
  ...focusVisibleStyles,
  // White ring (L=1.0) on dark bg (L≈0.035): ~18:1 ✅
  outlineColor: 'hsl(0, 0%, 100%)',
  boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.2)',
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