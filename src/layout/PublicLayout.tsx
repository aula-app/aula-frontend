import { AppLink, ErrorBoundary } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { Box, Button, Divider, Grid, Stack } from '@mui/material/';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  document.title = t('generics.title'); // Also Update Tab Title

  return (
    <Stack mx="auto" width="100%" p={2} maxWidth="20rem" minHeight="100vh">
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
          {toggleBackToSignIn()}
          <LocaleSwitch />
        </Stack>
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src="/logo-text.svg" alt="aula" />
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
        <Stack>
          <Divider sx={{ mt: 1, mb: 2 }}>{t('generics.or')}</Divider>
          <Grid container justifyContent="space-between" gap={1} alignItems="center">
            <Button variant="contained" color="error" sx={{ flexGrow: 1, flexBasis: 1 }}>
              Google
            </Button>
            <Button variant="contained" color="info" sx={{ flexGrow: 1, flexBasis: 1 }}>
              Facebook
            </Button>
          </Grid>
          <Grid container justifyContent="center" alignItems="center" sx={{ mt: 3, mb: 1 }}>
            {toggleSignUp()}
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );

  function toggleBackToSignIn() {
    if (location.pathname !== '/') {
      return (
        <AppLink color="primary" component={AppLink} to="/">
          &lt; {t('login.button')}
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
        {t('login.noAccount')}
        <Button variant="text" component={AppLink} to="/signup">
          {t('login.sign')}
        </Button>
      </>
    );
  }
};

export default PublicLayout;
