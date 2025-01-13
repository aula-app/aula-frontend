import { AppIconButton, AppLink } from "@/components";
import AppSubmitButton from "@/components/AppSubmitButton";
import { loginUser } from "@/services/auth";
import { useAppStore } from "@/store";
import { localStorageGet, localStorageSet } from "@/utils";
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
import { useState } from "react";
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
  const jwt_token = localStorageGet("token");
  const [loginError, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const api_url = localStorageGet('api_url');

  const schema = yup
    .object({
      username: yup.string().required(t("validation.required")),
      password: yup
        .string()
        .required(t("validation.required"))
        .min(4, t("validation.min", { var: 4 }))
        .max(32, t("validation.max", { var: 32 }))
    })
    .required();

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
      dispatch({ type: 'ADD_POPUP', message: { message: t('generics.configError'), type: 'error' } });
      return;
    }

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await loginUser(api_url, formData, jwt_token, controller.signal);
      clearTimeout(timeoutId);
      setLoading(false);

      if (response.success !== true || !('JWT' in response)) {
        setError(
          'user_status' in response && response.user_status !== null
            ? response.user_status === 0
              ? t('login.accountInactive')
              : t('login.accountSuspended', {var: response.data ? t('login.accountSuspendDate', {var: response.data}) : ''})
            : t('login.loginError')
        );
        return;
      }

      localStorageSet("token", response.JWT);
      dispatch({ type: "LOG_IN" });
      navigate("/", { replace: true });
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          dispatch({ type: 'ADD_POPUP', message: { message: t('generics.timeout'), type: 'error' } });
        } else if (e.name === 'NetworkError') {
          dispatch({ type: 'ADD_POPUP', message: { message: t('generics.networkError'), type: 'error' } });
        } else {
          dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
        }
      }
    }
  };

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t("login.welcome")}
        </Typography>
        <Collapse in={loginError !== ''} sx={{ mb: 2 }}>
          <Alert
            variant="outlined"
            severity="error"
            onClose={() => setError('')}
          >
            {loginError}
          </Alert>
        </Collapse>
        <TextField
          required
          disabled={isLoading}
          label={t("login.login")}
          slotProps={{ input: { autoCapitalize: "none" } }}
          {...register("username")}
          error={errors.username ? true : false}
          helperText={errors.username?.message || " "}
          sx={{ mt: 0 }}
        />
        <TextField
          required
          disabled={isLoading}
          type={showPassword ? "text" : "password"}
          label={t("login.password")}
          {...register("password")}
          error={errors.password ? true : false}
          helperText={errors.password?.message || " "}
          sx={{ mt: 0 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? "visibilityOn" : "visibilityOff"}
                    title={showPassword ? t("generics.hide") : t("generics.show")}
                    onClick={handleShowPasswordClick}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </InputAdornment>
              ),
            }
          }}
        />
        <AppSubmitButton label={t("login.button")} disabled={isLoading} onClick={handleSubmit(onSubmit)} />

        <Grid container justifyContent="end" alignItems="center">
          <Button
            variant="text"
            color="secondary"
            component={AppLink}
            to="/recovery/password"
          >
            {t('login.forgot')}
          </Button>
        </Grid>
      </Stack>
      { oauthEnabled === "true" ? (<>
         <Stack direction='row' mb={2} alignItems='center'>
          <Divider sx={{flex: 1}} />
          <Typography px={2} color="secondary">{t('generics.or')}</Typography>
          <Divider sx={{flex: 1}} />
        </Stack>
        <Stack direction='column' mb={2} alignItems='center'>
         <AppSubmitButton 
           variant="outlined" 
           onClick={() => window.location.href="/api/controllers/login_oauth.php"} 
           label={t('login.oauthButton')}
           disabled={isLoading}
           aria-label={t('login.oauthButtonAriaLabel')}
         />
        </Stack>
         </>)
         : ''}

    </FormContainer>
    );
};

export default LoginView;
