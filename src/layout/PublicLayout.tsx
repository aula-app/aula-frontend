import { AppIconButton, AppLink, ErrorBoundary } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import SkipNavigation from '@/components/SkipNavigation';
import { localStorageGet, localStorageSet } from '@/utils';
import { Box, Button, Chip, Stack, useTheme } from '@mui/material/';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultConfig, getRuntimeConfig } from '../config';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [code, setCode] = useState<string>(localStorageGet('code'));

  const resetCode = async () => {
    localStorageSet('code', '').then(() => {
      navigate('/code');
    });
  };

  document.title = 'aula'; // Also Update Tab Title

  useEffect(() => {
    setCode(localStorageGet('code'));
  }, [location.pathname]);

  return (
    <Stack
      mx="auto"
      width="100%"
      p={2}
      maxWidth="20rem"
      sx={{
        height: '100%',
        paddingTop: `calc(${theme.spacing(2)} + var(--safe-area-inset-top, 0px))`,
        paddingLeft: `calc(0px + var(--safe-area-inset-left, 0px))`,
        paddingRight: `calc(0px + var(--safe-area-inset-right, 0px))`,
        paddingBottom: `calc(${theme.spacing(2)} + var(--safe-area-inset-bottom, 0px))`,
      }}
    >
      <SkipNavigation mainContentId="public-content" />
      <Stack>
        <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
          <Box flex={1}>{toggleBackToSignIn()}</Box>
          {defaultConfig.IS_MULTI && (
            <Stack direction="row" flex={1} justifyContent="center">
              {code ? (
                <Chip label={code} onClick={resetCode} onDelete={resetCode} />
              ) : (
                <Chip label={t('auth.login.reset_code')} />
              )}
            </Stack>
          )}
          <Stack direction="row" flex={1} justifyContent="end">
            <LocaleSwitch />
          </Stack>
        </Stack>
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src={`${getRuntimeConfig().BASENAME}img/Aula_Logo.svg`} alt={t('app.name.logo')} role="img" />
        </Box>
      </Stack>
      <Stack
        flex={1}
        component="main"
        id="public-content"
        width="100%"
        sx={{
          padding: 1,
          justifyContent: 'center',
        }}
        tabIndex={-1}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );

  function toggleBackToSignIn() {
    if (location.pathname !== '/') {
      return (
        <AppLink color="primary" component={AppLink} to="/">
          &lt; {t('auth.login.button')}
        </AppLink>
      );
    }
    return <Box></Box>;
  }

  function toggleSignUp() {
    if (location.pathname === '/signup') {
      return;
    }
    return (
      <>
        {t('auth.login.noAccount')}
        <Button variant="text" component={AppLink} to="/signup">
          {t('auth.register.button')}
        </Button>
      </>
    );
  }
};

export default PublicLayout;
