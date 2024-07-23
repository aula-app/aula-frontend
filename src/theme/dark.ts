import { PaletteOptions, ThemeOptions } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(133, 65%, 50%)',
  },
  secondary: {
    main: 'hsl(180, 10%, 50%)',
  },
  error: {
    main: 'hsl(355, 60%, 53%)',
  },
  warning: {
    main: 'hsl(40, 65%, 50%)',
  },
  info: {
    main: 'hsl(190, 65%, 50%)',
  },
  success: {
    main: 'hsl(113, 65%, 40%)',
  },
};

const PHASE_COLORS = {
  wild: {
    main: 'hsl(200, 30%, 30%)',
  },
  discussion: {
    main: 'hsl(260, 30%, 30%)',
  },
  approval: {
    main: 'hsl(320, 30%, 30%)',
  },
  voting: {
    main: 'hsl(40, 40%, 30%)',
  },
  results: {
    main: 'hsl(100, 30%, 30%)',
  },
};

const OTHER_COLORS = {
  comment: {
    main: blueGrey[800],
  },
  for: {
    main: 'hsl(120, 30%, 30%)',
  },
  neutral: {
    main: 'hsl(40, 40%, 30%)',
  },
  against: {
    main: 'hsl(350, 30%, 30%)',
  },
  disabled: {
    main: blueGrey[800],
  },
  message: {
    main: 'hsl(175, 30%, 30%)',
  },
  announcement: {
    main: 'hsl(220, 30%, 30%)',
  },
  alert: {
    main: 'hsl(325, 30%, 30%)',
  },
};

/**
 * MUI theme options for "Dark Mode"
 */
export const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      paper: blueGrey[800], // Gray 800 - Background of "Paper" based component
      default: blueGrey[900],
    },
    ...PALETTE_COLORS,
    ...PHASE_COLORS,
    ...OTHER_COLORS,
  },
};

export default DARK_THEME;
