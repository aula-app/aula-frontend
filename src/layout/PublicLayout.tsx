import { AppLink, ErrorBoundary } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useOnMobile } from '@/hooks';
import { Box, Button, Stack } from '@mui/material/';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const onMobile = useOnMobile();

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
      <Stack>
        <Stack direction="row" alignItems="start" justifyContent="space-between" sx={{ pb: 2 }}>
          {toggleBackToSignIn()}
          <LocaleSwitch />
        </Stack>
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src={`${import.meta.env.VITE_APP_BASENAME}img/Aula_Logo.svg`} alt="aula" />
        </Box>
      </Stack>
      <Stack
        flex={1}
        component="main"
        width="100%"
        sx={{
          padding: 1,
          justifyContent: 'center',
        }}
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
