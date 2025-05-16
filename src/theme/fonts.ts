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
      fontFamily: 'Vision',
    },
    body2: {
      fontFamily: 'Vision',
      fontWeight: 300,
    },
    h1: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 32 },
    h2: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 24 },
    h3: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 19 },
    h4: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 16 },
    h5: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 14 },
    h6: { fontFamily: 'tahoma', fontWeight: 700, fontSize: 13 },
  },
};

export default THEME_FONTS;
