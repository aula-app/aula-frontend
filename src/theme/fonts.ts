import { ThemeOptions } from '@mui/material';

/**
 * MUI theme options for "Dark Mode"
 */
const NUNITO = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif";

const THEME_FONTS: ThemeOptions = {
  typography: {
    fontFamily: NUNITO,
    allVariants: {
      fontFamily: NUNITO,
    },
    body1: {
      fontFamily: NUNITO,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: NUNITO,
      fontWeight: 300,
      fontSize: '0.875rem',
    },
    h1: { fontFamily: NUNITO, fontWeight: 700, fontSize: '2rem' },
    h2: { fontFamily: NUNITO, fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontFamily: NUNITO, fontWeight: 700, fontSize: '1.25rem' },
    h4: { fontFamily: NUNITO, fontWeight: 700, fontSize: '1rem' },
    h5: { fontFamily: NUNITO, fontWeight: 300, fontSize: '1rem' },
    h6: { fontFamily: NUNITO, fontWeight: 300, fontSize: '0.8rem' },
  },
};

export default THEME_FONTS;
