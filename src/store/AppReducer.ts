import { localStorageSet } from '@/utils';
import { AppStoreState } from './AppStore';

/**
 * Reducer for global AppStore using "Redux styled" actions
 * @param {object} state - current/default state
 * @param {string} action.type - unique name of the action
 * @param {*} [action.payload] - optional data object or the function to get data object
 */
const AppReducer: React.Reducer<AppStoreState, any> = (state, action) => {
  switch (action.type || action.action) {
    case 'CURRENT_USER':
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    // case 'SIGN_UP':
    //   return { ...state };
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
    case 'ADD_BREADCRUMB_PHASE':
      let new_phase = [];
      if (state.breadcrumb.length == 2) {
        new_phase = [state.breadcrumb[0], action.path];
      } else {
        new_phase = [...state.breadcrumb, action.path];
      }
      return {
        ...state,
        breadcrumb: new_phase,
      };

    case 'SET_BREADCRUMB':
      return {
        ...state,
        breadcrumb: action.breadcrumb,
      };
    case 'DARK_MODE': {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    case 'ADD_POPUP': {
      return state.messages.find((messages) => messages.message === action?.message.message) // prevent duplicates
        ? state
        : { ...state, messages: [...state.messages, action?.message] };
    }
    case 'REMOVE_POPUP': {
      return { ...state, messages: [...state.messages.filter((e, i) => i !== action?.index)] };
    }
    case 'REMOVE_ALL_POPUP': {
      return { ...state, messages: [] };
    }
    default:
      return state;
  }
};

export default AppReducer;
