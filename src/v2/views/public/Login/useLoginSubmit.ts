import { getRuntimeConfig, loadRuntimeConfig, RuntimeConfig } from '@/config';
import { useSsoStatus } from '@/hooks';
import { handleOAuthLogin } from '@/services/auth';
import { declineAccountClaim } from '@/services/idpMigration';
import { loginUser } from '@/services/login';
import { completeSsoLink, initiateSso } from '@/services/sso';
import { useAppStore } from '@/store';
import { isSsoBrowserSupported, localStorageGet, localStorageSet, MIN_SSO_SAFARI_VERSION, parseJwt } from '@/utils';
import { useToast } from '@/v2/hooks';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

export type LoginFormValues = {
  username: string;
  password: string;
};

export const useLoginSubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isSsoLoading, setSsoLoading] = useState(false);
  const [loginError, setError] = useState<string>('');
  const [linkBanner, setLinkBanner] = useState<string>('');
  const [ssoLinkToken, setSsoLinkToken] = useState<string | null>(null);
  /** True when nobody knows yet whether this person has an aula account. */
  const [claimable, setClaimable] = useState(false);
  const [config, setConfig] = useState<RuntimeConfig | null>(null);

  const ssoStatus = useSsoStatus();
  const ssoBrowserSupported = useMemo(() => isSsoBrowserSupported(), []);

  const ssoAvailable = !!config?.IS_SSO_ENABLED && ssoStatus?.enabled === true;
  const ssoEnforced = ssoAvailable && ssoStatus?.required === true;
  const showPasswordLogin = !ssoEnforced || ssoLinkToken !== null;
  const ssoStatusPending =
    ssoLinkToken === null && (config === null || (!!config.IS_SSO_ENABLED && ssoStatus === undefined));

  useEffect(() => {
    const ssoError = searchParams.get('sso_error');
    const ssoLink = searchParams.get('sso_link');

    if (ssoError === 'account_link_required' && ssoLink) {
      setSsoLinkToken(ssoLink);
      // A claimable link comes from a school mid-migration: nobody knows yet
      // whether this person already has an aula account, so they have to be
      // able to say they do not.
      const isClaimable = searchParams.get('claimable') === '1';
      setClaimable(isClaimable);
      setLinkBanner(
        t(isClaimable ? 'idp.claim.banner' : 'errors.sso.account_link_required', {
          defaultValue:
            'We found an existing account for the email returned by your SSO provider. Log in once with your aula password to link the accounts; future SSO logins will go through directly.',
        })
      );
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
        runtimeConfig = getRuntimeConfig();
      } catch {
        runtimeConfig = await loadRuntimeConfig();
      }
      setConfig(runtimeConfig);
    })();
  }, []);

  const onSubmit = async (formData: LoginFormValues) => {
    const instanceApiUrl = await localStorageGet('api_url');

    if (!instanceApiUrl) {
      toast.error(t('errors.noServer'));
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
        if ('error_code' in response && response.error_code === 3) {
          const reason = 'error' in response && response.error ? String(response.error) : 'use_sso';
          setError(t(`errors.sso.${reason}`, { defaultValue: t('errors.sso.use_sso') }));
          return;
        }
        const message =
          'user_status' in response && response.user_status !== null
            ? response.user_status === 0
              ? t('errors.accountInactive')
              : t('errors.accountSuspended', {
                  var: response.data ? t('errors.accountSuspendDate', { var: response.data }) : '',
                })
            : t('errors.invalidCredentials');
        toast.error(message);
        return;
      }

      const responseJWT = parseJwt(response.JWT || '');

      if (responseJWT?.temp_pw) {
        navigate(`/password`, { replace: true, state: { tmp_jwt: response.JWT } });
        return;
      }

      if (ssoLinkToken) {
        const linkResult = await completeSsoLink(instanceApiUrl, ssoLinkToken, response.JWT || '');
        if (!linkResult.success) {
          setError(t(`errors.sso.${linkResult.error}`, { defaultValue: t('errors.sso.link_failed') }));
          return;
        }
        setSsoLinkToken(null);
      }

      localStorageSet('token', response.JWT);
      dispatch({ type: 'LOG_IN' });
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          toast.error(t('errors.timeout'));
        } else if (e.name === 'NetworkError') {
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.default'));
        }
      }
    }
  };

  const handleSsoLogin = async (options: { loginHint?: string } = {}) => {
    const instanceApiUrl = localStorageGet('api_url');
    if (!instanceApiUrl) {
      toast.error(t('errors.noServer'));
      return;
    }
    try {
      setSsoLoading(true);
      const url = await initiateSso(instanceApiUrl, options);

      if (Capacitor.isNativePlatform()) {
        // A Custom Tab keeps the login layered over the app; assigning
        // window.location here would send the WebView off-origin and Capacitor
        // would hand it to the system browser, stranding the user outside.
        await Browser.open({ url });
        return;
      }

      window.location.href = url;
    } catch {
      setSsoLoading(false);
      toast.error(t('errors.default'));
    }
  };

  // IdP-initiated entry (e.g. Eduplaces marketplace launch) lands here with
  // ?via=eduplaces. Trigger SSO automatically, preserving the upstream
  // login_hint so the user is not asked to identify themselves again.
  useEffect(() => {
    if (searchParams.get('via') !== 'eduplaces') return;
    if (ssoStatus === undefined) return;
    if (!ssoAvailable) return;
    if (!ssoBrowserSupported) return;
    const loginHint = searchParams.get('login_hint') ?? undefined;
    handleSsoLogin({ loginHint });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, ssoAvailable, ssoStatus]);

  const declineClaim = async () => {
    if (!ssoLinkToken) return;
    const jwt = await declineAccountClaim(ssoLinkToken);
    if (!jwt) {
      setError(t('idp.claim.declineFailed'));
      return;
    }
    handleOAuthLogin(jwt);
    dispatch({ type: 'LOG_IN' });
    navigate('/', { replace: true });
  };

  return {
    onSubmit,
    isLoading,
    isSsoLoading,
    loginError,
    setError,
    linkBanner,
    setLinkBanner,
    config,
    handleSsoLogin,
    ssoAvailable,
    ssoEnforced,
    showPasswordLogin,
    ssoStatusPending,
    ssoBrowserSupported,
    ssoLinkToken,
    claimable,
    declineClaim,
  };
};
