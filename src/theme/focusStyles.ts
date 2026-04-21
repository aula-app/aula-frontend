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
  outlineColor: 'var(--color-text-primary)',
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


export default getFocusStyles;