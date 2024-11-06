import '@fontsource-variable/nunito';
import '@fontsource-variable/open-sans';
import { ThemeOptions } from '@mui/material';

/**
 * MUI theme options for "Dark Mode"
 */
const THEME_FONTS: ThemeOptions = {
  typography: {
    allVariants: {
      fontFamily: 'Nunito Variable',
    },
    body1: {
      fontFamily: 'Open Sans Variable',
    },
    body2: {
      fontFamily: 'Open Sans Variable',
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
