import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';

const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: '#7DE293',
  contrastText: '#1C1D1F',
};

const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: '#a6a6a6',
  contrastText: '#1C1D1F',
};

const COLOR_ERROR: SimplePaletteColorOptions = {
  main: '#EF9A9A',
  contrastText: '#1C1D1F'
}

const COLOR_WARNING: SimplePaletteColorOptions = {
  main: '#ffdc82',
  contrastText: '#1C1D1F'
}

const COLOR_INFO: SimplePaletteColorOptions = {
  main: '#00c8ff',
  contrastText: '#1C1D1F'
}

const COLOR_SUCCESS: SimplePaletteColorOptions = {
  main: '#93cf4b',
  contrastText: '#1C1D1F'
}


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
