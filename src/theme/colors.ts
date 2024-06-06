import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';

const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: '#7DE293',
  contrastText: 'inherit',
};

const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: '#a6a6a6',
  contrastText: 'inherit',
};

const COLOR_ERROR: SimplePaletteColorOptions = {
  main: '#EF9A9A',
  contrastText: 'inherit',
};

const COLOR_WARNING: SimplePaletteColorOptions = {
  main: '#ffdc82',
  contrastText: 'inherit',
};

const COLOR_INFO: SimplePaletteColorOptions = {
  main: '#00c8ff',
  contrastText: 'inherit',
};

const COLOR_SUCCESS: SimplePaletteColorOptions = {
  main: '#93cf4b',
  contrastText: 'inherit',
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
