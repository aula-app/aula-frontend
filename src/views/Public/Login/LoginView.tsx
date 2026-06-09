import { AppIconButton, AppLink } from '@/components';
import { defaultConfig, getRuntimeConfig, loadRuntimeConfig, RuntimeConfig } from '@/config';
import { loginUser } from '@/services/login';
import { completeSsoLink, initiateSso } from '@/services/sso';
import { useAppStore } from '@/store';
import { LoginFormValues } from '@/types/LoginTypes';
import { localStorageGet, localStorageSet, parseJwt } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Collapse, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

/**
 * Renders "Login" view for Login flow
 * url: /login
 */

const LoginView = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<RuntimeConfig>(defaultConfig);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const [loginError, setError] = useState<string>('');
  const [linkBanner, setLinkBanner] = useState<string>('');
  const [ssoLinkToken, setSsoLinkToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSsoLoading, setSsoLoading] = useState(false);

  const schema = yup
    .object({
      username: yup.string().required(t('forms.validation.required')),
      password: yup
        .string()
        .required(t('forms.validation.required'))
        .min(4, t('forms.validation.minLength', { var: 4 }))
        .max(64, t('forms.validation.maxLength', { var: 64 })),
    })
    .required(t('forms.validation.required'));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleShowPasswordClick = () => {
    setShowPassword((oldValue) => !oldValue);
  };

  const onSubmit = async (formData: LoginFormValues) => {
    const instanceApiUrl = await localStorageGet('api_url');

    if (!instanceApiUrl) {
      dispatch({ type: 'ADD_TOAST', message: { message: t('errors.noServer'), type: 'error' } });
      return;
    }

    try {
      setLoading(true);

      const jwt_token = localStorageGet('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await loginUser(instanceApiUrl, formData, jwt_token, controller.signal);
      clearTimeout(timeoutId);
      setLoading(false);

      if (response.online_mode !== undefined && response.online_mode !== 1) {
        navigate('/offline', { replace: true });
        return;
      }

      if (response.data || !('JWT' in response)) {
        // error_code 3 means "this account / tenant requires SSO" — show a
        // dedicated message so the user understands to click the SSO button
        // instead of retrying the password.
        if ('error_code' in response && response.error_code === 3) {
          const reason = 'error' in response && response.error ? String(response.error) : 'use_sso';
          setError(t(`errors.sso.${reason}`, { defaultValue: t('errors.sso.use_sso') }));
          return;
        }
        setError(
          'user_status' in response && response.user_status !== null
            ? response.user_status === 0
              ? t('errors.accountInactive')
              : t('errors.accountSuspended', {
                  var: response.data ? t('errors.accountSuspendDate', { var: response.data }) : '',
                })
            : t('errors.invalidCredentials')
        );
        return;
      }

      const responseJWT = parseJwt(response.JWT || '');

      if (responseJWT?.temp_pw) {
        navigate(`/password`, { replace: true, state: { tmp_jwt: response.JWT } });
        return;
      }

      // If the user arrived here from an SSO callback that found an existing
      // legacy account, finish the link before completing login. The
      // /sso/link endpoint stamps sso_sub onto the row so future SSO logins
      // bypass this prompt.
      if (ssoLinkToken) {
        const linkResult = await completeSsoLink(instanceApiUrl, ssoLinkToken, response.JWT || '');
        if (!linkResult.success) {
          setError(t(`errors.sso.${linkResult.error}`, { defaultValue: t('errors.sso.link_failed') }));
          return;
        }
        setSsoLinkToken(null);
      }

      localStorageSet("token", response.JWT);
      dispatch({ type: "LOG_IN" });
      navigate("/", { replace: true });
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          dispatch({ type: 'ADD_TOAST', message: { message: t('errors.timeout'), type: 'error' } });
        } else if (e.name === 'NetworkError') {
          dispatch({ type: 'ADD_TOAST', message: { message: t('errors.network'), type: 'error' } });
        } else {
          dispatch({ type: 'ADD_TOAST', message: { message: t('errors.default'), type: 'error' } });
        }
      }
    }
  };

  const handleSsoLogin = async () => {
    const instanceApiUrl = localStorageGet('api_url');
    if (!instanceApiUrl) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.noServer'), type: 'error' } });
      return;
    }
    try {
      setSsoLoading(true);
      window.location.href = await initiateSso(instanceApiUrl);
    } catch {
      setSsoLoading(false);
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    }
  };

  useEffect(() => {
    const ssoError = searchParams.get('sso_error');
    const ssoLink  = searchParams.get('sso_link');

    if (ssoError === 'account_link_required' && ssoLink) {
      setSsoLinkToken(ssoLink);
      setLinkBanner(t('errors.sso.account_link_required', {
        defaultValue: 'We found an existing account for the email returned by your SSO provider. Log in once with your aula password to link the accounts; future SSO logins will go through directly.',
      }));
      return;
    }

    if (ssoError) {
      setError(t(`errors.sso.${ssoError}`, { defaultValue: t('errors.default') }));
    }
  }, [searchParams, t]);

  useEffect(() => {
    (async () => {
      let runtimeConfig: RuntimeConfig;
      try {
        // load config from localStorage (cache)
        runtimeConfig = getRuntimeConfig();
      } catch (err) {
        // load config from envvars or from //public-config.json
        runtimeConfig = await loadRuntimeConfig();
      }
      setConfig(runtimeConfig);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2}>
        <Typography variant="h2">{t('auth.messages.welcome')}</Typography>
        <Collapse in={linkBanner !== ''}>
          <Alert variant="outlined" severity="info" onClose={() => setLinkBanner('')}>
            {linkBanner}
          </Alert>
        </Collapse>
        <Collapse in={loginError !== ''}>
          <Alert variant="outlined" severity="error" onClose={() => setError('')}>
            {loginError}
          </Alert>
        </Collapse>
        <Stack gap={1}>
          <TextField
            required
            disabled={isLoading}
            label={t('auth.login.label')}
            id="login-username"
            slotProps={{
              input: {
                'aria-labelledby': 'login-username-label',
                'aria-invalid': !!errors.username,
                'aria-errormessage': errors.username ? 'username-error-message' : undefined,
                autoCapitalize: 'none',
              },
              htmlInput: {
                autoComplete: 'username',
              },
              inputLabel: {
                id: 'login-username-label',
                htmlFor: 'login-username',
              },
            }}
            {...register('username', {
              shouldUnregister: false,
            })}
            error={!!errors.username}
            helperText={<span id="username-error-message">{errors.username?.message || ''}</span>}
            sx={{ mt: 0 }}
          />
          <TextField
            required
            disabled={isLoading}
            type={showPassword ? 'text' : 'password'}
            label={t('auth.password.label')}
            id="login-password"
            {...register('password', {
              shouldUnregister: false,
            })}
            error={!!errors.password}
            helperText={<span id="password-error-message">{errors.password?.message || ''}</span>}
            sx={{ mt: 0 }}
            slotProps={{
              htmlInput: {
                autoComplete: 'current-password',
              },
              input: {
                'aria-labelledby': 'login-password-label',
                'aria-invalid': !!errors.password,
                'aria-errormessage': errors.password ? 'password-error-message' : undefined,
                autoCapitalize: 'none',
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label={t('ui.accessibility.togglePasswordVisibility')}
                      icon={showPassword ? 'visibilityOn' : 'visibilityOff'}
                      title={showPassword ? t('actions.hide') : t('actions.show')}
                      onClick={handleShowPasswordClick}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                id: 'login-password-label',
                htmlFor: 'login-password',
              },
            }}
          />
        </Stack>
        <Button type="submit" variant="contained" disabled={isLoading} aria-label={t('auth.login.button')}>
          {t('auth.login.button')}
        </Button>
        <Grid container justifyContent="end" alignItems="center">
          <Button
            variant="text"
            color="secondary"
            component={AppLink}
            to="/recovery/password"
            aria-label={t('auth.forgotPassword.link')}
          >
            {t('auth.forgotPassword.link')}
          </Button>
        </Grid>

        {(config.IS_OAUTH_ENABLED || config.IS_SSO_ENABLED) && (
          <>
            <Stack direction="row" mb={2} alignItems="center">
              <Divider sx={{ flex: 1 }} />
              <Typography px={2} color="secondary">
                {t('ui.common.or')}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>
            <Stack direction="column" gap={1} mb={2} alignItems="center">
              {config.IS_OAUTH_ENABLED && (
                <Button
                  variant="outlined"
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
                  variant="outlined"
                  color="secondary"
                  onClick={handleSsoLogin}
                  disabled={isLoading || isSsoLoading}
                  aria-label={t('auth.sso.arialabel')}
                >
                  {t('auth.sso.button')}
                </Button>
              )}
            </Stack>
          </>
        )}
      </Stack>
    </form>
  );
};

export default LoginView;
