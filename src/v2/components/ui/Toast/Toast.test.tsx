import { AppStore, useAppStore } from '@/store';
import { ToastMessage } from '@/store/AppStore';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, NavigateFunction, useNavigate } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Toast from './Toast';
import { addToast, toastQueue } from './toastQueue';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }));

let navigate: NavigateFunction;

const Navigator = () => {
  navigate = useNavigate();
  return null;
};

const renderToasts = () =>
  render(
    <MemoryRouter initialEntries={['/messages']}>
      <Navigator />
      <Toast />
    </MemoryRouter>
  );

const raise = (toast: ToastMessage) => act(() => addToast(toast));
const visibleToasts = () => screen.queryAllByTestId(/^toast-/).map((toast) => toast.textContent);

afterEach(() => {
  act(() => toastQueue.clear());
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

    expect(visibleToasts()).toHaveLength(2);
  });

  it('keeps a toast raised together with the navigation it leads to', () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000);
    renderToasts();
    raise({ type: 'success', message: 'Archived' });
    act(() => navigate('/messages/m2'));

    expect(visibleToasts()).toEqual(['Archived']);
  });

  it('skips a toast identical to one already showing', () => {
    renderToasts();
    raise({ type: 'success', message: 'Archived' });
    raise({ type: 'success', message: 'Archived' });

    expect(visibleToasts()).toHaveLength(1);
  });

  it('shows each toast as a labelled alert dialog in a labelled region, with a labelled close button', () => {
    renderToasts();
    raise({ type: 'error', message: 'Failed' });

    expect(screen.getByRole('region', { name: '1 notification.' })).toBeTruthy();
    expect(screen.getByRole('alertdialog', { name: 'Failed' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('moves keyboard focus into the toasts with F6', async () => {
    renderToasts();
    raise({ type: 'error', message: 'Failed' });

    await userEvent.keyboard('{F6}');

    expect(screen.getByRole('region', { name: '1 notification.' }).contains(document.activeElement)).toBe(true);
  });

  it('shows toasts raised through the app store', () => {
    localStorage.setItem('darkMode', 'false');
    const Raiser = () => {
      const [, dispatch] = useAppStore();
      return <button onClick={() => dispatch({ type: 'ADD_TOAST', message: { type: 'info', message: 'Saved' } })} />;
    };
    render(
      <AppStore>
        <MemoryRouter>
          <Raiser />
          <Toast />
        </MemoryRouter>
      </AppStore>
    );

    act(() => screen.getAllByRole('button')[0].click());

    expect(visibleToasts()).toEqual(['Saved']);
  });
});
