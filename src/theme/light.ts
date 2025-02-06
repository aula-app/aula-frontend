import { PaletteOptions, ThemeOptions } from '@mui/material';
import { amber, blue, cyan, deepOrange, deepPurple, green, grey, red } from '@mui/material/colors';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(133, 65%, 70%)',
  },
  secondary: {
    main: 'hsl(180, 10%, 50%)',
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
    light: blue[50],
    main: blue[100],
    dark: blue[300],
  },
  discussion: {
    light: deepPurple[50],
    main: deepPurple[100],
    dark: deepPurple[300],
  },
  approval: {
    light: deepOrange[50],
    main: deepOrange[100],
    dark: deepOrange[300],
  },
  voting: {
    light: amber[50],
    main: amber[100],
    dark: amber[400],
  },
  results: {
    light: green[50],
    main: green[100],
    dark: green[300],
  },
};

const OTHER_COLORS = {
  against: {
    main: red[100],
  },
  alert: {
    main: red[100],
  },
  announcements: {
    main: deepPurple[100],
  },
  bugs: {
    main: grey[200],
  },
  comments: {
    main: grey[200],
  },
  disabled: {
    main: grey[200],
  },
  for: {
    main: green[100],
  },
  reports: {
    main: amber[200],
  },
  messages: {
    main: cyan[100],
  },
  neutral: {
    main: amber[100],
  },
  requests: {
    main: grey[200],
  },
};
/**
 * MUI theme options for "Light Mode"
 */
const LIGHT_THEME: ThemeOptions = {
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
