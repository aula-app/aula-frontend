import { AppAction, AppContext, AppStoreState, ToastMessage } from '@/store/AppStore';
import AppReducer from '@/store/AppReducer';
import { act, render, screen } from '@testing-library/react';
import { Dispatch, ReactNode, useReducer } from 'react';
import { MemoryRouter, NavigateFunction, useNavigate } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Toast from './Toast';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const initialState: AppStoreState = {
  darkMode: false,
  isAuthenticated: true,
  hasConsent: true,
  toasts: [],
  breadcrumb: [],
  lastScroll: 0,
  lastIdeaList: '',
};

let dispatch: Dispatch<AppAction>;
let navigate: NavigateFunction;

const Store = ({ children }: { children: ReactNode }) => {
  const value = useReducer(AppReducer, initialState);
  dispatch = value[1];
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const Navigator = () => {
  navigate = useNavigate();
  return null;
};

const renderToasts = () =>
  render(
    <MemoryRouter initialEntries={['/messages']}>
      <Store>
        <Navigator />
        <Toast />
      </Store>
    </MemoryRouter>
  );

const raise = (message: Omit<ToastMessage, 'id' | 'createdAt'>) => act(() => dispatch({ type: 'ADD_TOAST', message }));
const visibleToasts = () => screen.queryAllByTestId(/^toast-/).map((toast) => toast.textContent);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Toast', () => {
  it('clears success and info toasts that were already showing when the user navigates away', () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0);
    renderToasts();
    raise({ type: 'success', message: 'Archived' });
    raise({ type: 'info', message: 'Copied' });
    raise({ type: 'error', message: 'Failed' });

    now.mockReturnValue(5000);
    act(() => navigate('/settings/messages'));

    expect(visibleToasts()).toEqual(['Failed']);
  });

  it('keeps warnings and app-wide toasts across navigation', () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0);
    renderToasts();
    raise({ type: 'warning', message: 'Careful' });
    raise({ type: 'info', message: 'Update available', persistent: true });

    now.mockReturnValue(5000);
    act(() => navigate('/settings/messages'));

    expect(visibleToasts()).toEqual(['Careful', 'Update available']);
  });

  it('keeps a toast raised together with the navigation it leads to', () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000);
    renderToasts();
    raise({ type: 'success', message: 'Archived' });
    act(() => navigate('/messages/m2'));

    expect(visibleToasts()).toEqual(['Archived']);
  });

  it('announces only through the hidden live regions, inside a labelled region', () => {
    renderToasts();
    raise({ type: 'error', message: 'Failed' });
    raise({ type: 'success', message: 'Archived' });

    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'v2.ui.a11y.notifications' })).toBeTruthy();
  });
});
