import { localStorageGet } from '@/utils';
import {
  ComponentType,
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { addToast } from '@/v2/components/ui/Toast/toastQueue';
import AppReducer from './AppReducer';

/**
 * AppState structure and initial values
 */

export interface ToastMessage {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  /** Survives navigation. */
  persistent?: boolean;
}

export interface AppStoreState {
  darkMode: boolean;
  isAuthenticated: boolean;
  hasConsent: boolean;
  currentUser?: object | undefined;
  breadcrumb: [string, string][];
  lastScroll: number;
  lastIdeaList: string;
}
export type AppAction =
  | { type: 'LOG_IN' }
  | { type: 'LOG_OUT' }
  | { type: 'CURRENT_USER'; currentUser?: object; payload?: object }
  | { type: 'SAVE_SCROLL'; lastScroll: number; lastIdeaList: string }
  | { type: 'HAS_CONSENT'; payload: boolean }
  | { type: 'SET_BREADCRUMB'; breadcrumb: [string, string][] }
  | { type: 'DARK_MODE'; payload: boolean }
  | { type: 'ADD_TOAST'; message: ToastMessage };

const INITIAL_APP_STATE: AppStoreState = {
  darkMode: false, // Overridden by useMediaQuery('(prefers-color-scheme: dark)') in AppStore
  isAuthenticated: false, // Overridden in AppStore by checking auth token
  hasConsent: false,
  breadcrumb: [],
  lastScroll: 0,
  lastIdeaList: '',
};

/**
 * Instance of React Context for global AppStore
 */
type AppContextReturningType = [AppStoreState, Dispatch<AppAction>];
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
  const savedDarkMode = localStorage.getItem('darkMode');
  const darkMode = savedDarkMode !== null ? savedDarkMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const token = localStorageGet('token');
  const tokenExists = Boolean(token !== undefined);

  const initialState: AppStoreState = {
    ...INITIAL_APP_STATE,
    isAuthenticated: tokenExists,
    darkMode: darkMode,
  };
  const [state, reducerDispatch] = useReducer(AppReducer, initialState);
  const dispatch = useCallback<Dispatch<AppAction>>(
    (action) => (action.type === 'ADD_TOAST' ? addToast(action.message) : reducerDispatch(action)),
    []
  );
  const value = useMemo<AppContextReturningType>(() => [state, dispatch], [state, dispatch]);

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

export { AppContext, AppStoreProvider as AppStore, useAppStore, withAppStore };
