import { PaletteOptions, ThemeOptions } from '@mui/material';

const PALETTE_COLORS: Partial<PaletteOptions> = {
  primary: {
    main: 'hsl(134, 72%, 67%)',
  },
  secondary: {
    main: 'hsl(0, 0%, 68%)',
  },
  error: {
    main: 'hsl(0, 84%, 77%)',
  },
  warning: {
    main: 'hsl(45, 100%, 79%)',
  },
  info: {
    main: 'hsl(204, 82%, 80%)',
  },
  success: {
    main: 'hsl(134, 72%, 67%)',
  },
};

const BASE_COLORS = {
  themeBlue: {
    light: 'hsl(210, 100%, 45%)',
    main: 'hsl(210, 100%, 35%)',
    dark: 'hsl(210, 100%, 25%)',
    darker: 'hsl(210, 100%, 15%)',
  },
  themePurple: {
    light: 'hsl(270, 50%, 57%)',
    main: 'hsl(270, 50%, 45%)',
    dark: 'hsl(270, 50%, 32%)',
    darker: 'hsl(270, 50%, 20%)',
  },
  themeRed: {
    light: 'hsl(0, 84%, 50%)',
    main: 'hsl(0, 84%, 40%)',
    dark: 'hsl(0, 84%, 28%)',
    darker: 'hsl(0, 84%, 16%)',
  },
  themeYellow: {
    light: 'hsl(45, 100%, 29%)',
    main: 'hsl(45, 100%, 23%)',
    dark: 'hsl(45, 100%, 17%)',
    darker: 'hsl(45, 100%, 11%)',
  },
  themeGreen: {
    light: 'hsl(134, 72%, 31%)',
    main: 'hsl(134, 72%, 24%)',
    dark: 'hsl(134, 72%, 17%)',
    darker: 'hsl(134, 72%, 11%)',
  },
  themeGrey: {
    light: 'hsl(0, 0%, 46%)',
    main: 'hsl(0, 0%, 36%)',
    dark: 'hsl(0, 0%, 25%)',
    darker: 'hsl(0, 0%, 14%)',
  },
};

const PHASE_COLORS = {
  wild: {
    light: 'hsl(210, 100%, 45%)',
    main: 'hsl(210, 100%, 35%)',
    dark: 'hsl(210, 100%, 25%)',
    darker: 'hsl(210, 100%, 15%)',
  },
  discussion: {
    light: 'hsl(270, 50%, 57%)',
    main: 'hsl(270, 50%, 45%)',
    dark: 'hsl(270, 50%, 32%)',
    darker: 'hsl(270, 50%, 20%)',
  },
  approval: {
    light: 'hsl(25, 84%, 40%)',
    main: 'hsl(25, 84%, 32%)',
    dark: 'hsl(25, 84%, 22%)',
    darker: 'hsl(25, 84%, 14%)',
  },
  voting: {
    light: 'hsl(45, 100%, 29%)',
    main: 'hsl(45, 100%, 23%)',
    dark: 'hsl(45, 100%, 17%)',
    darker: 'hsl(45, 100%, 11%)',
  },
  results: {
    light: 'hsl(134, 72%, 31%)',
    main: 'hsl(134, 72%, 24%)',
    dark: 'hsl(134, 72%, 17%)',
    darker: 'hsl(134, 72%, 11%)',
  },
};

const OTHER_COLORS = {
  input: {
    border: 'rgba(255, 255, 255, 0.50)', // 4.36:1 on dark bg ✅ WCAG 1.4.11 (was 0.23 = ~1.7:1 ❌)
    borderHover: 'rgba(255, 255, 255, 0.87)',
  },
  against: {
    main: 'hsl(0, 84%, 50%)',
  },
  alert: {
    main: 'hsl(0, 84%, 50%)',
  },
  announcements: {
    main: 'hsl(270, 50%, 45%)',
  },
  bugs: {
    main: 'hsl(0, 0%, 36%)',
  },
  comments: {
    main: 'hsl(0, 0%, 36%)',
  },
  disabled: {
    main: 'hsl(0, 0%, 36%)',
  },
  for: {
    main: 'hsl(134, 72%, 31%)',
  },
  messages: {
    main: 'hsl(175, 30%, 38%)',
  },
  neutral: {
    main: 'hsl(45, 100%, 29%)',
  },
  reports: {
    main: 'hsl(45, 100%, 29%)',
  },
  requests: {
    main: 'hsl(0, 0%, 36%)',
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
