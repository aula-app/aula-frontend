import { AppThemeProvider } from '@/theme';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components';
import { getRuntimeConfig } from './config';
import { useAndroidBackButton, useDeepLinks } from './hooks';
import Routes from './routes';
import { AppStore } from './store';

const AppContent: React.FC = () => {
  useAndroidBackButton();
  useDeepLinks();

  return <Routes />;
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
