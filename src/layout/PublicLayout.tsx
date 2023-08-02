import { Fragment, FunctionComponent, PropsWithChildren } from 'react';
import { Button, Divider, Grid, Stack } from '@mui/material/';
import { AppLink, ErrorBoundary } from '../components';
import { useOnMobile } from '../hooks/layout';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import { Box } from '@mui/joy';
import { useLocation } from 'react-router-dom';

const TITLE_PUBLIC = 'aula';

/**
 * Renders "Public Layout" composition
 */
const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();
  const location = useLocation();


  const title = TITLE_PUBLIC;
  document.title = title; // Also Update Tab Title

  function toggleSignUp() {
    if (location.pathname === '/auth/signup') {
      return (
        <Fragment>
          Already a user?
          <Button variant="text" color="primary" component={AppLink} to="/">
            Sign In
          </Button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        Need an account?
        <Button variant="text" color="primary" component={AppLink} to="/auth/signup">
          Sign Up
        </Button>
      </Fragment>
    );
  }

  return (
    <Box
      bgcolor="#fff"
      width="100%"
      height="100vh"
      overflow="auto"
      sx={{ paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT }}
    >
      <Stack
        height="100%"
        mx="auto"
        maxWidth="18rem"
        sx={{
          padding: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src="/logo-text.svg" alt="aula" />
        </Box>
        <Stack component="main" sx={{ flexGrow: 1 }} width="100%">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
          <Stack>
            <Divider sx={{ mt: 1, mb: 2 }}>or</Divider>
            <Grid container justifyContent="space-between" gap={1} alignItems="center">
              <Button variant="contained" color="error" sx={{ flexGrow: 1, flexBasis: 1 }}>
                Google
              </Button>
              <Button variant="contained" color="info" sx={{ flexGrow: 1, flexBasis: 1 }}>
                Facebook
              </Button>
            </Grid>
            <Grid container justifyContent="end" alignItems="center" sx={{ mt: 1 }}>
              {toggleSignUp()}
            </Grid>
          </Stack>
        </Stack>
        <Box sx={{ flexGrow: 1, minHeight: '5rem', width: '100%' }}></Box>
      </Stack>
    </Box>
  );
};

export default PublicLayout;
