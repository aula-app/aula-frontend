import { ThemeOptions } from '@mui/material';
import { PALETTE_COLORS } from './colors';

/**
 * MUI theme options for "Light Mode"
 */
export const LIGHT_THEME: ThemeOptions = {
  palette: {
    mode: 'light',
     background: {
      default: '#F1F2EE', // Gray 100 - Background of "Paper" based component
    //   default: '#FFFFFF',
    },
    ...PALETTE_COLORS,
  },
};

export default LIGHT_THEME;
