import {
  createContext,
  useReducer,
  useContext,
  FunctionComponent,
  Dispatch,
  ComponentType,
  PropsWithChildren,
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppReducer from './AppReducer';
import { localStorageGet } from '@/utils';

/**
 * AppState structure and initial values
 */
export interface AppStoreState {
  darkMode: boolean;
  isAuthenticated: boolean;
  hasConsent: boolean;
  currentUser?: object | undefined;
  errors: string[];
}
const INITIAL_APP_STATE: AppStoreState = {
  darkMode: false, // Overridden by useMediaQuery('(prefers-color-scheme: dark)') in AppStore
  isAuthenticated: false, // Overridden in AppStore by checking auth token
  hasConsent: false,
  errors: [],
};

/**
 * Instance of React Context for global AppStore
 */
type AppContextReturningType = [AppStoreState, Dispatch<any>];
const AppContext = createContext<AppContextReturningType>([INITIAL_APP_STATE, () => null]);

/**
 * Main global Store as HOC with React Context API
 *
 * import {AppStoreProvider} from './store'
 * ...
 * <AppStoreProvider>
 *  <App/>
 * </AppStoreProvider>
 */
const AppStoreProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const previousDarkMode = Boolean(localStorageGet('darkMode'));
  const darkMode = previousDarkMode !== undefined ? previousDarkMode : prefersDarkMode;
  const token = localStorageGet('token');
  const tokenExists = Boolean(token !== undefined);

  const initialState: AppStoreState = {
    ...INITIAL_APP_STATE,
    isAuthenticated: tokenExists,
    darkMode: darkMode,
  };
  const value: AppContextReturningType = useReducer(AppReducer, initialState);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to use the AppStore in functional components
 *
 * import {useAppStore} from './store'
 * ...
 * const [state, dispatch] = useAppStore();
 */
const useAppStore = (): AppContextReturningType => useContext(AppContext);
/**
 * HOC to inject the ApStore to class component, also works for functional components
 *
 * import {withAppStore} from './store'
 * ...
 * class MyComponent
 * ...
 * export default withAppStore(MyComponent)
 */
interface WithAppStoreProps {
  store: object;
}
const withAppStore =
  (Component: ComponentType<WithAppStoreProps>): FunctionComponent =>
  (props) => {
    return <Component {...props} store={useAppStore()} />;
  };

export { AppStoreProvider as AppStore, AppContext, useAppStore, withAppStore };
