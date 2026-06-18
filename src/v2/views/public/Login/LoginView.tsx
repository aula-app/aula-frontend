import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
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
  const { onSubmit, isLoading, isSsoLoading, loginError, setError, linkBanner, setLinkBanner, config, handleSsoLogin } =
    useLoginSubmit();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.login.title', { var: 'Aula' })}</h1>

      {linkBanner && (
        <div className="flex items-start gap-2 rounded-lg border border-info/40 bg-info/10 px-3 py-2 text-sm text-foreground">
          <span className="flex-1">{linkBanner}</span>
          <button
            type="button"
            onClick={() => setLinkBanner('')}
            className="text-muted hover:text-foreground"
            aria-label={t('actions.close')}
          >
            ×
          </button>
        </div>
      )}

      {loginError && (
        <div className="flex items-start gap-2 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-foreground">
          <span className="flex-1">{loginError}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-muted hover:text-foreground"
            aria-label={t('actions.close')}
          >
            ×
          </button>
        </div>
      )}

      <div className="rounded-box flex flex-col">
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
        <Button type="submit" disabled={isLoading || isSsoLoading} data-testid="submit-login">
          {t('v2.page.login.button')}
        </Button>
        <Link to="/recovery" className="ml-auto px-2 text-sm text-muted mt-4">
          {t('v2.page.recovery.link')}
        </Link>
      </div>

      {(config.IS_OAUTH_ENABLED || config.IS_SSO_ENABLED) && (
        <>
          <div className="flex items-center gap-2 text-muted">
            <div className="flex-1 border-t border-current" />
            <span className="text-sm">{t('ui.common.or')}</span>
            <div className="flex-1 border-t border-current" />
          </div>
          <div className="flex flex-col gap-2 items-center">
            {config.IS_OAUTH_ENABLED && (
              <Button
                outlined
                color="secondary"
                onClick={() => (window.location.href = '/api/controllers/login_oauth.php')}
                disabled={isLoading || isSsoLoading}
                aria-label={t('auth.oauth.arialabel')}
              >
                {t('auth.oauth.button')}
              </Button>
            )}
            {config.IS_SSO_ENABLED && (
              <Button
                outlined
                color="secondary"
                onClick={handleSsoLogin}
                disabled={isLoading || isSsoLoading}
                aria-label={t('auth.sso.arialabel')}
              >
                {t('auth.sso.button')}
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default LoginView;
