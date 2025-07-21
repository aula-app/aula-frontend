import { AppLink, ErrorBoundary } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import SkipNavigation from '@/components/SkipNavigation';
import { Box, Button, Stack } from '@mui/material/';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getRuntimeConfig } from '../config';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  document.title = 'aula'; // Also Update Tab Title

  return (
    <Stack
      mx="auto"
      width="100%"
      p={2}
      maxWidth="20rem"
      sx={{
        height: '100%',
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <SkipNavigation mainContentId="public-content" />
      <Stack>
        <Stack direction="row" alignItems="start" justifyContent="space-between" sx={{ pb: 2 }}>
          {toggleBackToSignIn()}
          <LocaleSwitch />
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
