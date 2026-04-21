import { ThemeOptions } from '@mui/material';

/**
 * MUI theme options for "Dark Mode"
 */
const THEME_FONTS: ThemeOptions = {
  typography: {
    allVariants: {
      fontFamily: 'Vision',
      // WCAG 1.4.12: Text Spacing — minimum values so containers never clip text
      lineHeight: 1.5,       // ≥ 1.5× font size
      letterSpacing: '0.12em', // ≥ 0.12× font size
      wordSpacing: '0.16em',   // ≥ 0.16× font size
    },
    body1: {
      fontFamily: 'Vision',
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Vision',
      fontWeight: 300,
      fontSize: '0.875rem',
    },
    h1: { fontFamily: 'tahoma', fontWeight: 700, fontSize: '2rem' },
    h2: { fontFamily: 'tahoma', fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontFamily: 'tahoma', fontWeight: 700, fontSize: '1.25rem' },
    h4: { fontFamily: 'tahoma', fontWeight: 700, fontSize: '1rem' },
    h5: { fontFamily: 'tahoma', fontWeight: 300, fontSize: '1rem' },
    h6: { fontFamily: 'tahoma', fontWeight: 300, fontSize: '0.8rem' },
  },
};

export default THEME_FONTS;
