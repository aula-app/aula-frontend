import { PaletteOptions, ThemeOptions } from '@mui/material';
import { amber, blue, cyan, deepOrange, deepPurple, green, grey, red } from '@mui/material/colors';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(133, 65%, 70%)',
  },
  secondary: {
    main: 'hsl(180, 10%, 70%)',
  },
  error: {
    main: 'hsl(355, 60%, 73%)',
  },
  warning: {
    main: 'hsl(40, 65%, 70%)',
  },
  info: {
    main: 'hsl(190, 65%, 70%)',
  },
  success: {
    main: 'hsl(113, 65%, 60%)',
  },
};

const PHASE_COLORS = {
  wild: {
    main: blue[100],
  },
  discussion: {
    main: deepPurple[100],
  },
  approval: {
    main: deepOrange[100],
  },
  voting: {
    main: amber[100],
  },
  results: {
    main: green[100],
  },
  message: {
    main: cyan[100],
  },
  announcement: {
    main: deepPurple[100],
  },
  alert: {
    main: red[100],
  },
};

const OTHER_COLORS = {
  comment: {
    main: grey[200],
  },
  for: {
    main: green[100],
  },
  neutral: {
    main: amber[100],
  },
  against: {
    main: red[100],
  },
  disabled: {
    main: grey[200],
  },
};
/**
 * MUI theme options for "Light Mode"
 */
export const LIGHT_THEME: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: '#FFFFFF',
    },
    ...PALETTE_COLORS,
    ...PHASE_COLORS,
    ...OTHER_COLORS,
  },
};

export default LIGHT_THEME;
