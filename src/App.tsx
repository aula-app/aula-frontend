import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components';
import Layout from './layout';
import Routes from './routes';
import { AppStore } from './store';
import { AppThemeProvider } from './theme';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Root Application Component
 */
const App = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <Auth0Provider
          domain={import.meta.env.VITE_APP_AUTH_DOMAIN}
          clientId={import.meta.env.VITE_APP_AUTH_ID}
          authorizationParams={{
            redirect_uri: `${window.location.origin}/api/controllers/auth`,
          }}
        >
          <AppThemeProvider>
            <BrowserRouter>
              <Layout>
                <Routes />
              </Layout>
            </BrowserRouter>
          </AppThemeProvider>
        </Auth0Provider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
