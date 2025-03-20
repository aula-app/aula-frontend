import { PaletteOptions, ThemeOptions } from '@mui/material';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(134, 20%, 40%)',
  },
  secondary: {
    main: 'hsl(200, 19%, 40%)',
  },
  error: {
    main: 'hsl(358, 40%, 50%)',
  },
  warning: {
    main: 'hsl(45, 45%, 50%)',
  },
  info: {
    main: 'hsl(205, 30%, 50%)',
  },
  success: {
    main: 'hsl(134, 20%, 40%)',
  },
};

const BASE_COLORS = {
  themeBlue: {
    light: 'hsl(205, 30%, 40%)',
    main: 'hsl(205, 30%, 30%)',
    dark: 'hsl(205, 30%, 20%)',
    darker: 'hsl(205, 30%, 10%)',
  },
  themePurple: {
    light: 'hsl(275, 25%, 40%)',
    main: 'hsl(275, 25%, 30%)',
    dark: 'hsl(275, 25%, 20%)',
    darker: 'hsl(275, 25%, 10%)',
  },
  themeRed: {
    light: 'hsl(358, 35%, 40%)',
    main: 'hsl(358, 35%, 30%)',
    dark: 'hsl(358, 35%, 20%)',
    darker: 'hsl(358, 35%, 10%)',
  },
  themeYellow: {
    light: 'hsl(45, 45%, 40%)',
    main: 'hsl(45, 45%, 30%)',
    dark: 'hsl(45, 45%, 20%)',
    darker: 'hsl(45, 45%, 10%)',
  },
  themeGreen: {
    light: 'hsl(134, 20%, 40%)',
    main: 'hsl(134, 20%, 30%)',
    dark: 'hsl(134, 20%, 20%)',
    darker: 'hsl(134, 20%, 10%)',
  },
  themeGrey: {
    light: 'hsl(200, 19%, 50%)',
    main: 'hsl(200, 19%, 40%)',
    dark: 'hsl(200, 19%, 20%)',
    darker: 'hsl(200, 19%, 10%)',
  },
};

const PHASE_COLORS = {
  wild: {
    light: 'hsl(205, 30%, 40%)',
    main: 'hsl(205, 30%, 30%)',
    dark: 'hsl(205, 30%, 20%)',
    darker: 'hsl(205, 30%, 10%)',
  },
  discussion: {
    light: 'hsl(275, 25%, 40%)',
    main: 'hsl(275, 25%, 30%)',
    dark: 'hsl(275, 25%, 20%)',
    darker: 'hsl(275, 25%, 10%)',
  },
  approval: {
    light: 'hsl(358, 35%, 40%)',
    main: 'hsl(358, 35%, 30%)',
    dark: 'hsl(358, 35%, 20%)',
    darker: 'hsl(358, 35%, 10%)',
  },
  voting: {
    light: 'hsl(45, 45%, 40%)',
    main: 'hsl(45, 45%, 30%)',
    dark: 'hsl(45, 45%, 20%)',
    darker: 'hsl(45, 45%, 10%)',
  },
  results: {
    light: 'hsl(134, 20%, 40%)',
    main: 'hsl(134, 20%, 30%)',
    dark: 'hsl(134, 20%, 20%)',
    darker: 'hsl(134, 20%, 10%)',
  },
};

const OTHER_COLORS = {
  input: {
    border: 'rgba(255, 255, 255, 0.23)',
    borderHover: 'rgba(255, 255, 255, 0.87)',
  },
  against: {
    main: 'hsl(358, 35%, 30%)',
  },
  alert: {
    main: 'hsl(358, 35%, 30%)',
  },
  announcements: {
    main: 'hsl(275, 25%, 30%)',
  },
  bugs: {
    main: 'hsl(200, 19%, 30%)',
  },
  comments: {
    main: 'hsl(200, 19%, 30%)',
  },
  disabled: {
    main: 'hsl(200, 19%, 30%)',
  },
  for: {
    main: 'hsl(134, 20%, 30%)',
  },
  messages: {
    main: 'hsl(175, 30%, 30%)',
  },
  neutral: {
    main: 'hsl(45, 45%, 30%)',
  },
  reports: {
    main: 'hsl(45, 45%, 30%)',
  },
  requests: {
    main: 'hsl(200, 19%, 30%)',
  },
};

/**
 * MUI theme options for "Dark Mode"
 */
const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      paper: 'hsl(200, 19%, 25%)',
      default: 'hsl(200, 19%, 20%)',
    },
    text: {
      primary: 'hsl(0, 0%, 100%)',
    },
    ...BASE_COLORS,
    ...PALETTE_COLORS,
    ...PHASE_COLORS,
    ...OTHER_COLORS,
  },
};

export default DARK_THEME;
