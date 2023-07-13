import { ThemeOptions } from '@mui/material';
import '@fontsource-variable/nunito'
import '@fontsource-variable/open-sans'


/**
 * MUI theme options for "Dark Mode"
 */
export const THEME_FONTS: ThemeOptions = {
  typography: {
    allVariants: {
      fontFamily: 'Nunito Variable',
    },
    body1: {
      fontFamily: 'Open Sans Variable',
    },
    body2: {
      fontFamily: 'Open Sans Variable',
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  }
};

export default THEME_FONTS;
