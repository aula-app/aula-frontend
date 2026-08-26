import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components';
import { getRuntimeConfig } from './config';
import { useAndroidBackButton, useDeepLinks } from './hooks';
import Layout from './layout';
import Routes from './routes';
import { AppStore } from './store';
import { AppThemeProvider } from './theme';

const AppContent: React.FC = () => {
  useAndroidBackButton();
  useDeepLinks();

  return (
    <Layout>
      <Routes />
    </Layout>
  );
};

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
