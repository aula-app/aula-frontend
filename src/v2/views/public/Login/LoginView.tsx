import Eduplaces from '@/components/Buttons/Eduplaces/Eduplaces';
import { MIN_SSO_SAFARI_VERSION } from '@/utils';
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import InstanceCodeField from '@/v2/components/input/InstanceCodeField';
import { useInstanceCode } from '@/v2/components/input/InstanceCodeField/useInstanceCode';
import Link from '@/v2/components/navigation/Link';
import Collapse from '@/v2/components/ui/Collapse';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useLoginSubmit } from './useLoginSubmit';

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 64;

const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const {
    onSubmit,
    isLoading,
    isSsoLoading,
    handleSsoLogin,
    loginError,
    setError,
    linkBanner,
    setLinkBanner,
    ssoAvailable,
    showPasswordLogin,
    ssoStatusPending,
    ssoBrowserSupported,
    ssoLinkToken,
    claimable,
    declineClaim,
  } = useLoginSubmit();
  const {
    instanceCode,
    setInstanceCode,
    isEditing,
    startEditing,
    error: codeError,
    isLoading: codeLoading,
    validateCode,
    showField,
  } = useInstanceCode();

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('v2.form.validation.required')),
        password: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const wrappedSubmit = async (data: { username: string; password: string }) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.login.title', { var: 'Aula' })}</h1>

      <Collapse open={linkBanner !== ''}>
        <div className="flex flex-col gap-2 rounded-box bg-info text-info-fg p-3 text-sm" role="status">
          <div className="flex items-start justify-between gap-2">
            <span>{linkBanner}</span>
            <button
              type="button"
              onClick={() => setLinkBanner('')}
              aria-label={t('actions.close')}
              className="shrink-0 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
          {claimable && ssoLinkToken && (
            <Button color="secondary" onClick={declineClaim} data-testid="idp-claim-decline" className="self-start">
              {t('idp.claim.noAccount')}
            </Button>
          )}
        </div>
      </Collapse>

      <Collapse open={loginError !== ''}>
        <div
          className="flex items-start justify-between gap-2 rounded-box bg-error text-error-fg p-3 text-sm"
          role="alert"
        >
          <span>{loginError}</span>
          <button
            type="button"
            onClick={() => setError('')}
            aria-label={t('actions.close')}
            className="shrink-0 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </Collapse>

      {ssoStatusPending ? (
        <div
          role="status"
          aria-label={t('v2.ui.a11y.loading')}
          className="mx-auto my-4 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        <>
          {(showField || showPasswordLogin) && (
            <div className="rounded-box flex flex-col gap-2">
              {showField && (
                <InstanceCodeField
                  value={instanceCode}
                  onChange={setInstanceCode}
                  error={codeError}
                  isEditing={isEditing}
                  onEditClick={startEditing}
                  onConfirmClick={() => {
                    validateCode();
                  }}
                  disabled={isLoading || codeLoading}
                />
              )}
              {showPasswordLogin && (
                <>
                  <TextInput
                    label={t('v2.form.login.label')}
                    required
                    autoComplete="username"
                    autoCapitalize="none"
                    error={errors.username?.message}
                    {...register('username')}
                  />
                  <TextInput
                    label={t('v2.form.password.label')}
                    type="password"
                    required
                    autoComplete="current-password"
                    autoCapitalize="none"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <Button type="submit" disabled={isLoading || codeLoading} data-testid="submit-login">
                    {t('v2.page.login.button')}
                  </Button>
                  <Link to="/recovery" className="ml-auto px-2 text-sm text-text-secondary mt-4">
                    {t('v2.page.recovery.link')}
                  </Link>
                </>
              )}
            </div>
          )}

          {ssoAvailable && ssoLinkToken === null && (
            <>
              {showPasswordLogin && (
                <div className="flex items-center gap-2 text-muted">
                  <div className="flex-1 border-t border-current" />
                  <span className="text-sm">{t('ui.common.or')}</span>
                  <div className="flex-1 border-t border-current" />
                </div>
              )}
              <div className="flex flex-col gap-2 items-center">
                {!ssoBrowserSupported && (
                  <div className="rounded-box bg-error text-error-fg p-3 text-sm" role="alert">
                    {t('auth.sso.unsupportedBrowser', { version: MIN_SSO_SAFARI_VERSION })}
                  </div>
                )}
                <Eduplaces
                  label={t('auth.sso.button')}
                  onClick={() => handleSsoLogin()}
                  disabled={isLoading || isSsoLoading}
                />
                <p className="text-sm text-text-secondary text-center">{t('auth.sso.hint')}</p>
              </div>
            </>
          )}
        </>
      )}
    </form>
  );
};

export default LoginView;
