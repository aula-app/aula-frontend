import { useAppStore } from '@/store';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import DARK_THEME from './dark';
import THEME_FONTS from './fonts';
import LIGHT_THEME from './light';

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
  // TODO: Make theme changes after full app loading.
  // Maybe we need to use https://github.com/pacocoursey/next-themes npm
  // Also take a look on this tutorial https://medium.com/@luca_79189/how-to-get-a-flickerless-persistent-dark-mode-in-your-next-js-app-example-with-mui-9581ea898314
  const theme = createTheme({
    ...THEME_FONTS,
    ...useMemo(() => (state.darkMode ? DARK_THEME : LIGHT_THEME), [state.darkMode]),
    // Add accessibility-focused theme options
    components: {
      MuiButtonBase: {
        defaultProps: {
          // Ensures consistent keyboard navigation behavior
          disableRipple: false,
        },
        styleOverrides: {
          root: {
            // Ensure focus styles are visible for keyboard navigation
            '&:focus-visible': {
              outline: '2px solid',
              outlineOffset: 2,
              outlineColor: state.darkMode ? '#90caf9' : '#1976d2',
            },
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: '2px solid',
              outlineOffset: 2,
              outlineColor: state.darkMode ? '#90caf9' : '#1976d2',
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            // Increase label contrast for better readability
            color: state.darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
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
