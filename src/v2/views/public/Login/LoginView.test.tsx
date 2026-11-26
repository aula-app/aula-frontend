import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginView from './LoginView';

const onSubmit = vi.fn();
const validateAndSaveInstanceCode = vi.fn();

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/config', () => ({ getRuntimeConfig: () => ({ IS_MULTI: true }) }));
vi.mock('@/utils', () => ({ localStorageGet: () => false, MIN_SSO_SAFARI_VERSION: 16 }));
vi.mock('@/services/instance', () => ({
  validateAndSaveInstanceCode: (code: string) => validateAndSaveInstanceCode(code),
}));
vi.mock('./useLoginSubmit', () => ({
  useLoginSubmit: () => ({
    onSubmit,
    isLoading: false,
    isSsoLoading: false,
    handleSsoLogin: vi.fn(),
    loginError: '',
    setError: vi.fn(),
    linkBanner: '',
    setLinkBanner: vi.fn(),
    ssoAvailable: false,
    showPasswordLogin: true,
    ssoStatusPending: false,
    ssoBrowserSupported: true,
    ssoLinkToken: null,
    claimable: false,
    declineClaim: vi.fn(),
  }),
}));

// user-event's Enter doesn't submit forms in this jsdom setup.
const pressEnterIn = (input: HTMLElement) => fireEvent.submit((input as HTMLInputElement).form!);

const renderView = () =>
  render(
    <MemoryRouter>
      <LoginView />
    </MemoryRouter>
  );

describe('LoginView', () => {
  beforeEach(() => {
    onSubmit.mockReset();
    validateAndSaveInstanceCode.mockReset().mockResolvedValue(true);
  });

  it('confirms the instance code on Enter there, without logging in', async () => {
    const user = userEvent.setup();
    renderView();

    await user.type(screen.getByLabelText(/v2.form.login.label/), 'alice');
    await user.type(screen.getByLabelText(/v2.form.password.label/), 'secret');
    await user.type(screen.getByTestId('instance-code'), 'abc');
    pressEnterIn(screen.getByTestId('instance-code'));

    await waitFor(() => expect(validateAndSaveInstanceCode).toHaveBeenCalledWith('abc'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('logs in on Enter in the password field', async () => {
    const user = userEvent.setup();
    renderView();

    await user.type(screen.getByTestId('instance-code'), 'abc');
    await user.type(screen.getByLabelText(/v2.form.login.label/), 'alice');
    await user.type(screen.getByLabelText(/v2.form.password.label/), 'secret');
    pressEnterIn(screen.getByLabelText(/v2.form.password.label/));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ username: 'alice', password: 'secret' }));
    expect(validateAndSaveInstanceCode).toHaveBeenCalledWith('abc');
  });
});
