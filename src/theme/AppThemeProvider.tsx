import { useAppStore } from '@/store';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useEffect, useMemo } from 'react';
import DARK_THEME from './dark';
import THEME_FONTS from './fonts';
import LIGHT_THEME from './light';
import getFocusStyles from './focusStyles';

// Setting .prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

// Client-side cache, shared for the whole session of the user in the browser.
const CLIENT_SIDE_EMOTION_CACHE = createEmotionCache();

interface Props extends PropsWithChildren {
  emotionCache?: EmotionCache; // You can omit it if you don't want to use Emotion styling library
}

/**
 * Renders composition of Emotion's CacheProvider + MUI's ThemeProvider to wrap content of entire App
 * The Light or Dark themes applied depending on global .darkMode state
 * @param {EmotionCache} [emotionCache] - shared Emotion's cache to use in the App
 */
const AppThemeProvider: FunctionComponent<Props> = ({ children, emotionCache = CLIENT_SIDE_EMOTION_CACHE }) => {
  const [state] = useAppStore();

  // Sync Tailwind dark mode class with MUI dark mode state
  // The tailwind-theme.css file uses @variant dark to automatically switch colors
  useEffect(() => {
    const html = document.documentElement;
    if (state.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [state.darkMode]);

  // TODO: Make theme changes after full app loading.
  // Maybe we need to use https://github.com/pacocoursey/next-themes npm
  // Also take a look on this tutorial https://medium.com/@luca_79189/how-to-get-a-flickerless-persistent-dark-mode-in-your-next-js-app-example-with-mui-9581ea898314
  const theme = createTheme({
    ...THEME_FONTS,
    ...useMemo(() => (state.darkMode ? DARK_THEME : LIGHT_THEME), [state.darkMode]),
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': getFocusStyles(state.darkMode),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': getFocusStyles(state.darkMode),
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': getFocusStyles(state.darkMode),
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': getFocusStyles(state.darkMode),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&.Mui-selected.Mui-focusVisible': {
              ...getFocusStyles(state.darkMode),
              outlineOffset: 0,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': {
              ...getFocusStyles(state.darkMode),
              textDecoration: 'underline',
            },
          },
        },
      },
      // WCAG 1.4.12: MuiChip uses a fixed `height` (32px / 24px) which clips text
      // when letter-spacing or line-height are overridden. Switch to minHeight so
      // the chip expands rather than truncating its label.
      MuiChip: {
        styleOverrides: {
          root: {
            height: 'auto',
            minHeight: 32,
          },
          sizeSmall: {
            minHeight: 24,
          },
          label: {
            // Allow label to wrap if word-spacing/letter-spacing pushes it wider
            whiteSpace: 'normal',
            paddingTop: 4,
            paddingBottom: 4,
          },
          labelSmall: {
            paddingTop: 2,
            paddingBottom: 2,
          },
        },
      },
      // WCAG 1.4.12: MUI hardcodes lineHeight: 1.4375em on FormLabel — override to meet minimum
      MuiFormLabel: {
        styleOverrides: {
          root: {
            lineHeight: 1.5,
          },
        },
      },
      // WCAG 1.4.12: MUI hardcodes lineHeight: 1.4375em on InputBase input; browsers also reset
      // word-spacing on form elements so it must be explicitly set here
      MuiInputBase: {
        styleOverrides: {
          input: {
            lineHeight: 1.5,
            wordSpacing: '0.16em',
          },
        },
      },
    },
  });

  return (
    <CacheProvider value={emotionCache}>
      {/* <StyledEngineProvider injectFirst> use this instead of Emotion's <CacheProvider/> if you want to use alternate styling library */}
      <ThemeProvider theme={theme}>
        <CssBaseline /* MUI Styles */ />
        {children}
      </ThemeProvider>
      {/* </StyledEngineProvider> */}
    </CacheProvider>
  );
};

export default AppThemeProvider;
