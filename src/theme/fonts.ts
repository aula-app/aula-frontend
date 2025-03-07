import { ThemeOptions } from '@mui/material';

/**
 * MUI theme options for "Dark Mode"
 */
const THEME_FONTS: ThemeOptions = {
  typography: {
    allVariants: {
      fontFamily: 'Vision',
    },
    body1: {
      fontFamily: 'Tahoma',
    },
    body2: {
      fontFamily: 'Tahoma',
      fontWeight: 300,
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
};

export default THEME_FONTS;
