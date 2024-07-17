import { localStorageSet } from '@/utils';
import { AppStoreState } from './AppStore';

/**
 * Reducer for global AppStore using "Redux styled" actions
 * @param {object} state - current/default state
 * @param {string} action.type - unique name of the action
 * @param {*} [action.payload] - optional data object or the function to get data object
 */
const AppReducer: React.Reducer<AppStoreState, any> = (state, action) => {
  // console.log('AppReducer() - action:', action);
  switch (action.type || action.action) {
    case 'CURRENT_USER':
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    case 'SIGN_UP':
    case 'LOG_IN':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOG_OUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: undefined, // Also reset previous user data
      };
    case 'HAS_CONSENT':
      return {
        ...state,
        hasConsent: action.payload,
      };
    case 'DARK_MODE': {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    case 'ADD_ERROR': {
      return { ...state, errors: [...state.errors, action?.message] };
    }
    case 'REMOVE_ERROR': {
      return { ...state, errors: [...state.errors.filter((e, i) => i !== action?.index)] };
    }
    case 'REMOVE_ALL_ERRORS': {
      return { ...state, errors: [] };
    }
    default:
      return state;
  }
};

export default AppReducer;
