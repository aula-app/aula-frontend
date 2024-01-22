import { Fragment, FunctionComponent, PropsWithChildren } from 'react';
import { Button, Divider, Grid, Box, Stack } from '@mui/material/';
import { AppLink, ErrorBoundary } from '@/components';
import { useLocation } from 'react-router-dom';

const TITLE_PUBLIC = 'aula';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  document.title = TITLE_PUBLIC; // Also Update Tab Title

  const location = useLocation();

  return (
    <Stack
      bgcolor="#fff"
      width="100%"
      minHeight="100vh"
    >
      <Box sx={{flexGrow: 1}}></Box>
      <Stack
        mx="auto"
        maxWidth="18rem"
        width="100%"
        sx={{
          padding: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{my: 1, mr: "auto"}}>
          {toggleBackToSignIn()}
        </Box>
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
            <Grid container justifyContent="end" alignItems="center" sx={{ mt: 3, mb: 1 }}>
              {toggleSignUp()}
            </Grid>
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{flexGrow: 1}}></Box>
    </Stack>
  );

  function toggleBackToSignIn() {
    if (location.pathname !== '/') {
      return (
        <Button color="secondary" component={AppLink} to="/">
          &lt; Sign In
        </Button>
      )
    }
    return (
      <Box height="2.25rem"></Box>
    )
  }

  function toggleSignUp() {
    if (location.pathname === '/signup') {
      return;
    }
    return (
      <Fragment>
        Need an account?
        <Button variant="text" color="primary" component={AppLink} to="/signup">
          Sign Up
        </Button>
      </Fragment>
    );
  }
};

export default PublicLayout;
