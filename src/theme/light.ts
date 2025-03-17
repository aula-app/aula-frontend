import { PaletteOptions, ThemeOptions } from '@mui/material';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(134, 72%, 67%)',
  },
  secondary: {
    main: 'hsl(0, 0%, 59%)',
  },
  error: {
    main: 'hsl(0, 84%, 76%)',
  },
  warning: {
    main: 'hsl(45, 100%, 79%)',
  },
  info: {
    main: 'hsl(204, 82%, 86%)',
  },
  success: {
    main: 'hsl(134, 72%, 67%)',
  },
};

const BASE_COLORS = {
  themeBlue: {
    light: 'hsl(210, 100%, 94%)',
    main: 'hsl(210, 100%, 86%)',
    dark: 'hsl(210, 88%, 67%)',
    darker: 'hsl(210, 61%, 63%)',
  },
  themePurple: {
    light: 'hsl(270, 50%, 94%)',
    main: 'hsl(270, 50%, 82%)',
    dark: 'hsl(270, 50%, 70%)',
    darker: 'hsl(270, 25%, 47%)',
  },
  themeRed: {
    light: 'hsl(0, 100%, 94%)',
    main: 'hsl(0, 84%, 76%)',
    dark: 'hsl(0, 84%, 58%)',
    darker: 'hsl(0, 56%, 39%)',
  },
  themeYellow: {
    light: 'hsl(45, 100%, 90%)',
    main: 'hsl(45, 100%, 79%)',
    dark: 'hsl(45, 100%, 68%)',
    darker: 'hsl(45, 100%, 56%)',
  },
  themeGreen: {
    light: 'hsl(134, 72%, 94%)',
    main: 'hsl(134, 72%, 83%)',
    dark: 'hsl(134, 72%, 67%)',
    darker: 'hsl(134, 28%, 49%)',
  },
  themeGrey: {
    light: 'hsl(0, 0%, 95%)',
    main: 'hsl(0, 0%, 88%)',
    dark: 'hsl(0, 0%, 75%)',
    darker: 'hsl(0, 0%, 59%)',
  },
};

const PHASE_COLORS = {
  wild: {
    light: 'hsl(210, 100%, 94%)',
    main: 'hsl(210, 100%, 86%)',
    dark: 'hsl(210, 88%, 67%)',
    darker: 'hsl(210, 61%, 63%)',
  },
  discussion: {
    light: 'hsl(270, 50%, 94%)',
    main: 'hsl(270, 50%, 82%)',
    dark: 'hsl(270, 50%, 70%)',
    darker: 'hsl(270, 25%, 47%)',
  },
  approval: {
    light: 'hsl(25, 100%, 94%)',
    main: 'hsl(25, 84%, 76%)',
    dark: 'hsl(25, 84%, 58%)',
    darker: 'hsl(25, 56%, 39%)',
  },
  voting: {
    light: 'hsl(45, 100%, 90%)',
    main: 'hsl(45, 100%, 79%)',
    dark: 'hsl(45, 100%, 68%)',
    darker: 'hsl(45, 100%, 56%)',
  },
  results: {
    light: 'hsl(134, 72%, 94%)',
    main: 'hsl(134, 72%, 88%)',
    dark: 'hsl(134, 72%, 67%)',
    darker: 'hsl(134, 28%, 49%)',
  },
};

const OTHER_COLORS = {
  input: {
    border: 'rgba(0, 0, 0, 0.23)',
    borderHover: 'rgba(0, 0, 0, 0.87)',
  },
  against: {
    main: 'hsl(0, 84%, 76%)',
  },
  alert: {
    main: 'hsl(0, 84%, 76%)',
  },
  announcements: {
    main: 'hsl(270, 50%, 82%)',
  },
  bugs: {
    main: 'hsl(0, 0%, 90%)',
  },
  comments: {
    main: 'hsl(0, 0%, 90%)',
  },
  disabled: {
    main: 'hsl(0, 0%, 90%)',
  },
  for: {
    main: 'hsl(134, 72%, 88%)',
  },
  reports: {
    main: 'hsl(45, 100%, 79%)',
  },
  messages: {
    main: 'hsl(210, 100%, 86%)',
  },
  neutral: {
    main: 'hsl(45, 100%, 79%)',
  },
  requests: {
    main: 'hsl(0, 0%, 90%)',
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
    ...BASE_COLORS,
    ...PALETTE_COLORS,
    ...PHASE_COLORS,
    ...OTHER_COLORS,
  },
};

export default LIGHT_THEME;
