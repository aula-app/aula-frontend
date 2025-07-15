import { AppIconButton, AppLink } from "@/components";
import { loginUser } from "@/services/login";
import { useAppStore } from "@/store";
import { localStorageGet, localStorageSet, parseJwt } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Collapse,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { getConfig, loadConfig } from "../../../config";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { LoginFormValues } from "@/types/LoginTypes";
import { validateAndSaveInstanceCode } from "@/services/instance";

/**
 * Renders "Login" view for Login flow
 * url: /login
 */

const LoginView = () => {
  const { t } = useTranslation();
  const oauthEnabled = getConfig("IS_OAUTH_ENABLED");
  const isMultiInstance = getConfig("IS_MULTI");
  const [instanceApiUrl, setInstanceApiUrl] = useState<string>(localStorageGet("api_url"));
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [loginError, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const schema = yup
    .object({
      username: yup.string().required(t("forms.validation.required")),
      password: yup
        .string()
        .required(t("forms.validation.required"))
        .min(4, t("forms.validation.minLength", { var: 4 }))
        .max(32, t("forms.validation.maxLength", { var: 32 }))
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

  const resetCode = async () => {
    localStorageSet('code', '').then(() => {
      navigate('/code');
    });
  }

  const onSubmit = async (formData: LoginFormValues) => {
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

      if (response.data || !('JWT' in response)) {
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

  useEffect(() => {
    (async () => {
      // if any of the configs is missing
      if (typeof getConfig("CENTRAL_API_URL") !== 'string') {
        // load config from envvars or from //public-config.json
        await loadConfig();
      }

      // if this instance's BE api url is not defined
      if (!instanceApiUrl) {
        if (isMultiInstance) {
          // get the instance api url based on the instance code
          await validateAndSaveInstanceCode(localStorageGet('code'));
          setInstanceApiUrl(localStorageGet('api_url'));
        } else {
          // if SINGLE, reuse the "CENTRAL_API_URL" as this instance's BE api url
          setInstanceApiUrl(getConfig("CENTRAL_API_URL") as string);
        }
      }
    })()
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2}>
        <Typography variant="h2">
          {t("auth.messages.welcome")}
        </Typography>
        <Collapse in={loginError !== ''}>
          <Alert
            variant="outlined"
            severity="error"
            onClose={() => setError('')}
          >
            {loginError}
          </Alert>
        </Collapse>
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
              input: {
                "aria-labelledby": "login-password-label",
                "aria-invalid": !!errors.password,
                "aria-errormessage": errors.password ? "password-error-message" : undefined,
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
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
          {isMultiInstance && (<Button
            variant="text"
            color="secondary"
            component={AppLink}
            onClick={resetCode}
          >
            {t('auth.login.reset_code')}
          </Button>)}

        </Grid>

        {oauthEnabled && (
          <>
            <Stack direction='row' mb={2} alignItems='center'>
              <Divider sx={{ flex: 1 }} />
              <Typography px={2} color="secondary">{t('ui.common.or')}</Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>
            <Stack direction='column' mb={2} alignItems='center'>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.location.href = "/api/controllers/login_oauth.php"}
                disabled={isLoading}
                aria-label={t('auth.oauth.arialabel')}
              >{t('auth.oauth.button')}</Button>
            </Stack>
          </>
        )}
      </Stack>
    </form>
  );
};

export default LoginView;
