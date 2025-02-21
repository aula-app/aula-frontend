import { AppLink, ErrorBoundary } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { Box, Button, Stack } from '@mui/material/';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  document.title = 'aula'; // Also Update Tab Title

  return (
    <Stack mx="auto" width="100%" p={2} maxWidth="20rem" minHeight="100vh">
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
          {toggleBackToSignIn()}
          <LocaleSwitch />
        </Stack>
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src={`${import.meta.env.VITE_APP_BASENAME}/logo-text.svg`} alt="aula" />
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
