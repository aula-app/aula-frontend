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
import { useEffect, useState } from "react";
import { FormContainer, useForm } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { LoginFormValues } from "@/types/LoginTypes";

/**
 * Renders "Login" view for Login flow
 * url: /login
 */

const LoginView = () => {
  const { t } = useTranslation();
  const oauthEnabled = import.meta.env.VITE_APP_OAUTH;
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [loginError, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [api_url, setApiUrl] = useState(import.meta.env.VITE_APP_API_URL);

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

  const onSubmit = async (formData: LoginFormValues) => {
    if (!api_url) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.noServer'), type: 'error' } });
      return;
    }

    try {
      setLoading(true);

      const jwt_token = localStorageGet("token");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await loginUser(api_url, formData, jwt_token, controller.signal);
      clearTimeout(timeoutId);
      setLoading(false);

      if (response.data || !('JWT' in response)) {
        setError(
          'user_status' in response && response.user_status !== null
            ? response.user_status === 0
              ? t('errors.accountInactive')
              : t('errors.accountSuspended', {var: response.data ? t('errors.accountSuspendDate', {var: response.data}) : ''})
            : t('errors.invalidCredentials')
        );
        return;
      }

      const responseJWT = parseJwt(response.JWT || '');

      if(responseJWT?.temp_pw) {
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
    if(localStorageGet('api_url')) setApiUrl(localStorageGet('api_url'));
  }, []);

  return (
    <FormContainer>
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
          inputProps={{ 
            "aria-labelledby": "login-username-label",
            autoCapitalize: "none" 
          }}
          InputLabelProps={{ 
            id: "login-username-label", 
            htmlFor: "login-username" 
          }}
          {...register("username", {
            shouldUnregister: false
          })}
          error={!!errors.username}
          helperText={`${errors.username?.message || ''}`}
          sx={{ mt: 0 }}
        />
        <TextField
          required
          disabled={isLoading}
          type={showPassword ? "text" : "password"}
          label={t("auth.password.label")}
          id="login-password"
          inputProps={{
            "aria-labelledby": "login-password-label"
          }}
          InputLabelProps={{ 
            id: "login-password-label", 
            htmlFor: "login-password" 
          }}
          {...register("password", {
            shouldUnregister: false
          })}
          error={!!errors.password}
          helperText={`${errors.password?.message || ''}`}
          sx={{ mt: 0 }}
          slotProps={{
            input: {
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
            }
          }}
        />
        </Stack>
        <Button 
          variant="contained" 
          disabled={isLoading} 
          onClick={handleSubmit(onSubmit)}
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
        </Grid>
      </Stack>
      { oauthEnabled === "true" ? (<>
         <Stack direction='row' mb={2} alignItems='center'>
          <Divider sx={{flex: 1}} />
          <Typography px={2} color="secondary">{t('ui.common.or')}</Typography>
          <Divider sx={{flex: 1}} />
        </Stack>
        <Stack direction='column' mb={2} alignItems='center'>
         <Button
           variant="outlined"
           color="secondary"
           onClick={() => window.location.href="/api/controllers/login_oauth.php"}
           disabled={isLoading}
           aria-label={t('auth.oauth.arialabel')}
         >{t('auth.oauth.button')}</Button>
        </Stack>
         </>)
         : ''}

    </FormContainer>
    );
};

export default LoginView;
