import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components';
import Layout from './layout';
import Routes from './routes';
import { AppStore } from './store';
import { AppThemeProvider } from './theme';

/**
 * Root Application Component
 * Provides core application providers and routing setup
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppThemeProvider>
          <BrowserRouter basename={import.meta.env.VITE_APP_BASENAME}>
            <Layout>
              <Routes />
            </Layout>
          </BrowserRouter>
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
