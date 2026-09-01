import { AppIconButton, AppLink } from "@/components";
import Eduplaces from "@/components/Buttons/Eduplaces/Eduplaces";
import { getRuntimeConfig } from "@/config";
import { useSsoManaged } from "@/hooks";
import { handleOAuthLogin } from "@/services/auth";
import { declineAccountClaim } from "@/services/idpMigration";
import { loginUser } from "@/services/login";
import { completeSsoLink, getSsoStatus, initiateSso } from "@/services/sso";
import { useAppStore } from "@/store";
import { LoginFormValues } from "@/types/LoginTypes";
import { isSsoBrowserSupported, localStorageGet, localStorageSet, MIN_SSO_SAFARI_VERSION, parseJwt } from "@/utils";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

/**
 * Renders "Login" view for Login flow
 * url: /login
 */
const LoginView = () => {
  const { t } = useTranslation();
  const isSsoManaged = useSsoManaged();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const [loginError, setError] = useState<string>('');
  const [linkBanner, setLinkBanner] = useState<string>('');
  /** True when nobody knows yet whether this person has an aula account. */
  const [claimable, setClaimable] = useState(false);
  const [ssoLinkToken, setSsoLinkToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  /**
   * Whether this particular school offers SSO, as opposed to whether this
   * deployment has an identity provider at all.
   *
   * `undefined` until the backend has been asked, `null` when it could not
   * answer. Only an explicit `false` hides the button: a school that does use
   * SSO must not lose its only way in because one request failed.
   */
  const [instanceSso, setInstanceSso] = useState<boolean | null | undefined>(undefined);

  const ssoAvailable = getRuntimeConfig().IS_SSO_ENABLED && instanceSso === true;
  const showPasswordLogin = !ssoAvailable || ssoLinkToken !== null;
  const ssoBrowserSupported = useMemo(() => isSsoBrowserSupported(), []);

  const ssoStatusPending =
    getRuntimeConfig().IS_SSO_ENABLED && instanceSso === undefined && ssoLinkToken === null;

  const schema = yup
    .object({
      username: yup.string().required(t("forms.validation.required")),
      password: yup
        .string()
        .required(t("forms.validation.required"))
        .min(4, t("forms.validation.minLength", { var: 4 }))
        .max(64, t("forms.validation.maxLength", { var: 64 }))
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
    const instanceApiUrl = await localStorageGet("api_url");

    if (!instanceApiUrl) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.noServer'), type: 'error' } });
      return;
    }

    try {
      setLoading(true);

      const jwt_token = localStorageGet("token");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await loginUser(instanceApiUrl, formData, jwt_token, controller.signal);
      clearTimeout(timeoutId);
      setLoading(false);

      if (response.online_mode !== undefined && response.online_mode !== 1) {
        navigate("/offline", { replace: true });
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
              : t('errors.accountSuspended', { var: response.data ? t('errors.accountSuspendDate', { var: response.data }) : '' })
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
          dispatch({ type: 'ADD_POPUP', message: { message: t('errors.timeout'), type: 'error' } });
        } else if (e.name === 'NetworkError') {
          dispatch({ type: 'ADD_POPUP', message: { message: t('errors.network'), type: 'error' } });
        } else {
          dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        }
      }
    }
  };

  const handleSsoLogin = async (options: { loginHint?: string } = {}) => {
    const instanceApiUrl = localStorageGet('api_url');
    if (!instanceApiUrl) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.noServer'), type: 'error' } });
      return;
    }
    try {
      const url = await initiateSso(instanceApiUrl, options);

      if (Capacitor.isNativePlatform()) {
        // Assigning window.location here would send the WebView off-origin,
        // which Capacitor answers by handing the URL to the system browser, so
        // the user leaves the app and cannot get back. A Custom Tab keeps the
        // login layered over the app, and the deep link the backend finishes
        // on (handled by useDeepLinks) closes it again.
        await Browser.open({ url });
        return;
      }

      window.location.href = url;
    } catch {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    }
  };

  useEffect(() => {
    const ssoError = searchParams.get('sso_error');
    const ssoLink = searchParams.get('sso_link');

    if (ssoError === 'account_link_required' && ssoLink) {
      setSsoLinkToken(ssoLink);
      // A claimable link comes from a school mid-migration: nobody knows yet
      // whether this person already has an aula account, so they have to be
      // able to say they do not.
      setClaimable(searchParams.get('claimable') === '1');
      setLinkBanner(t(searchParams.get('claimable') === '1'
        ? 'idp.claim.banner'
        : 'errors.sso.account_link_required', {
        defaultValue: 'We found an existing account for the email returned by your SSO provider. Log in once with your aula password to link the accounts; future SSO logins will go through directly.',
      }));
      return;
    }

    if (ssoError) {
      setError(t(`errors.sso.${ssoError}`, { defaultValue: t('errors.default') }));
    }
  }, [searchParams, t]);

  // IdP-initiated entry (e.g. Eduplaces marketplace launch) lands here with
  // ?via=eduplaces. The instance code is already in localStorage by the time
  // we get here (the guard + InstanceCodeView ensure that). Trigger the SSO
  // flow automatically, preserving the upstream login_hint so the user is
  // not asked to identify themselves again at Eduplaces.
  useEffect(() => {
    if (searchParams.get('via') !== 'eduplaces') return;
    // Wait for the school's own answer before bouncing anyone to Keycloak,
    // which would only be refused if the school has SSO switched off.
    if (instanceSso === undefined) return;
    if (!ssoAvailable) return;
    if (!ssoBrowserSupported) return;
    const loginHint = searchParams.get('login_hint') ?? undefined;
    handleSsoLogin({ loginHint });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, ssoAvailable, instanceSso]);

  useEffect(() => {
    (async () => {
      const instanceApiUrl = localStorageGet('api_url');
      if (!instanceApiUrl) {
        setInstanceSso(null);
        return;
      }

      setInstanceSso((await getSsoStatus(instanceApiUrl))?.enabled ?? null);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mb-auto mt-12">
      <Stack gap={2} alignItems="center">
        <Typography variant="h2">
          {t("auth.messages.welcome")}
        </Typography>
        <Collapse in={linkBanner !== ''}>
          <Alert
            variant="outlined"
            severity="info"
            onClose={() => setLinkBanner('')}
          >
            {linkBanner}
            {claimable && ssoLinkToken && (
              // A user that comes with SSO link needs to be able to decline
              // linking themselves to an existing aula-User
              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={async () => {
                  const jwt = await declineAccountClaim(ssoLinkToken);

                  if (!jwt) {
                    setError(t('idp.claim.declineFailed'));

                    return;
                  }

                  handleOAuthLogin(jwt);
                  dispatch({ type: 'LOG_IN' });
                  navigate('/', { replace: true });
                }}
                data-testid="idp-claim-decline"
              >
                {t('idp.claim.noAccount')}
              </Button>
            )}
          </Alert>
        </Collapse>
        <Collapse in={loginError !== ''}>
          <Alert
            variant="outlined"
            severity="error"
            onClose={() => setError('')}
          >
            {loginError}
          </Alert>
        </Collapse>

        {ssoStatusPending ?
          <CircularProgress />
          : (
            <>
              {showPasswordLogin && (
                <>
                  <Stack gap={1}>
                    <TextField
                      required
                      disabled={isLoading}
                      label={t("auth.login.label")}
                      id="login-username"
                      slotProps={{
                        input: {
                          "aria-labelledby": "login-username-label",
                          "aria-invalid": !!errors.username,
                          "aria-errormessage": errors.username ? "username-error-message" : undefined,
                          autoCapitalize: "none"
                        },
                        htmlInput: {
                          autoComplete: "username"
                        },
                        inputLabel: {
                          id: "login-username-label",
                          htmlFor: "login-username"
                        }
                      }}
                      {...register("username", {
                        shouldUnregister: false
                      })}
                      error={!!errors.username}
                      helperText={<span id="username-error-message">{errors.username?.message || ''}</span>}
                      sx={{ mt: 0 }}
                    />
                    <TextField
                      required
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      label={t("auth.password.label")}
                      id="login-password"
                      {...register("password", {
                        shouldUnregister: false
                      })}
                      error={!!errors.password}
                      helperText={<span id="password-error-message">{errors.password?.message || ''}</span>}
                      sx={{ mt: 0 }}
                      slotProps={{
                        htmlInput: {
                          autoComplete: "current-password"
                        },
                        input: {
                          "aria-labelledby": "login-password-label",
                          "aria-invalid": !!errors.password,
                          "aria-errormessage": errors.password ? "password-error-message" : undefined,
                          autoCapitalize: "none",
                          endAdornment: (
                            <InputAdornment position="end">
                              <AppIconButton
                                aria-label={t("ui.accessibility.togglePasswordVisibility")}
                                icon={showPassword ? "visibilityOn" : "visibilityOff"}
                                title={showPassword ? t("actions.hide") : t("actions.show")}
                                onClick={handleShowPasswordClick}
                                onMouseDown={(e) => e.preventDefault()}
                              />
                            </InputAdornment>
                          ),
                        },
                        inputLabel: {
                          id: "login-password-label",
                          htmlFor: "login-password"
                        }
                      }}
                    />
                  </Stack>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    aria-label={t("auth.login.button")}
                  >
                    {t("auth.login.button")}
                  </Button>
                  {!isSsoManaged && (
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
                  )}
                </>
              )}

              {ssoAvailable && ssoLinkToken === null && (
                <>
                  {showPasswordLogin && (
                    <Stack direction='row' mb={2} alignItems='center'>
                      <Divider sx={{ flex: 1 }} />
                      <Typography px={2} color="secondary">{t('ui.common.or')}</Typography>
                      <Divider sx={{ flex: 1 }} />
                    </Stack>
                  )}
                  <Stack direction='column' gap={1} mb={2} alignItems='center'>
                    {!ssoBrowserSupported && (
                      <Alert variant="outlined" severity="error" sx={{ mb: 5 }}>
                        {t('auth.sso.unsupportedBrowser', { version: MIN_SSO_SAFARI_VERSION })}
                      </Alert>
                    )}
                    <Eduplaces
                      label={t('auth.sso.button')}
                      onClick={() => handleSsoLogin()}
                    />
                    <Typography variant="caption" color="secondary" textAlign="center">
                      {t('auth.sso.hint')}
                    </Typography>
                  </Stack>
                </>
              )}
            </>
          )}
      </Stack>
    </form>
  );
};

export default LoginView;
