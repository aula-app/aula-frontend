import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components';
import { getRuntimeConfig } from './config';
import { useAndroidBackButton, useDeepLinks } from './hooks';
import Layout from './layout';
import Routes from './routes';
import { AppStore } from './store';
import { AppThemeProvider } from './theme';

/**
 * Inner component that uses router hooks
 * Must be inside BrowserRouter context
 */
const AppContent: React.FC = () => {
  // Handle Android back button navigation
  useAndroidBackButton();

  // Handle native deep-link callbacks (e.g. aula:// SSO callback)
  useDeepLinks();

  return (
    <Layout>
      <Routes />
    </Layout>
  );
};

/**
 * Root Application Component
 * Provides core application providers and routing setup
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppThemeProvider>
          <BrowserRouter basename={getRuntimeConfig().BASENAME}>
            <AppContent />
          </BrowserRouter>
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
