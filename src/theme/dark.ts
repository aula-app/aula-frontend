import { ThemeOptions } from '@mui/material';
import { PALETTE_COLORS } from './colors';

/**
 * MUI theme options for "Dark Mode"
 */
export const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      paper: '#535353', // Gray 800 - Background of "Paper" based component
      default: '#424242',
    },
    ...PALETTE_COLORS,
  },
};

export default DARK_THEME;
