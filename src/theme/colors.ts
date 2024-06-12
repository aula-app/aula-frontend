import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';

const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: 'hsl(133, 65%, 70%)',
};

const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: 'hsl(180, 10%, 70%)',
};

const COLOR_ERROR: SimplePaletteColorOptions = {
  main: 'hsl(355, 60%, 73%)'
};

const COLOR_WARNING: SimplePaletteColorOptions = {
  main: 'hsl(40, 65%, 70%)',
};

const COLOR_INFO: SimplePaletteColorOptions = {
  main: 'hsl(190, 65%, 70%)',
};

const COLOR_SUCCESS: SimplePaletteColorOptions = {
  main: 'hsl(110, 65%, 70%)',
};

/**
 * MUI colors set to use in theme.palette
 */
export const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: COLOR_PRIMARY,
  secondary: COLOR_SECONDARY,
  error: COLOR_ERROR,
  warning: COLOR_WARNING,
  info: COLOR_INFO,
  success: COLOR_SUCCESS,
};
