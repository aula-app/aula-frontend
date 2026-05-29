import { localStorageSet } from '@/utils';
import { AppStoreState, ToastMessage } from './AppStore';

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
    case 'SAVE_SCROLL':
      return {
        ...state,
        lastScroll: action.lastScroll,
        lastIdeaList: action.lastIdeaList
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
    case 'ADD_TOAST': {
      const incoming: ToastMessage = { ...action?.message, id: crypto.randomUUID() };
      // Prevent duplicate messages (same text + type)
      if (state.toasts.find((m) => m.message === incoming.message && m.type === incoming.type)) {
        return state;
      }
      const MAX_TOASTS = 3;
      if (state.toasts.length < MAX_TOASTS) {
        return { ...state, toasts: [...state.toasts, incoming] };
      }
      // Cap reached: drop oldest non-error to make room; if all are errors, drop the new one
      const oldestNonErrorIndex = state.toasts.findIndex((m) => m.type !== 'error');
      if (oldestNonErrorIndex === -1) {
        // All visible toasts are errors — only allow new errors to displace oldest error
        if (incoming.type !== 'error') return state;
        const [, ...rest] = state.toasts;
        return { ...state, toasts: [...rest, incoming] };
      }
      const trimmed = state.toasts.filter((_, i) => i !== oldestNonErrorIndex);
      return { ...state, toasts: [...trimmed, incoming] };
    }
    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter((m) => m.id !== action?.id) };
    }
    case 'REMOVE_ALL_TOASTS': {
      return { ...state, toasts: [] };
    }
    default:
      return state;
  }
};

export default AppReducer;
