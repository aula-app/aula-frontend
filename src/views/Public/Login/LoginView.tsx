import { AppIconButton, AppLink } from "@/components";
import AppSubmitButton from "@/components/AppSubmitButton";
import { useAppStore } from "@/store";
import { localStorageGet, localStorageSet } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Collapse,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useCallback, useState } from "react";
import { FormContainer, useForm } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

/**
 * Renders "Login" view for Login flow
 * url: /login
 */

const LoginView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const jwt_token = localStorageGet("token");
  const [loginError, setError] = useState(false);
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

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const onSubmit = async (formData: Object) => {
    try {
      setLoading(true)

      const request = await fetch(
        `${api_url}/api/controllers/login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt_token,
          },
          body: JSON.stringify(formData),
        }
      );

      setLoading(false)
      const response = await request.json() as { success: boolean, JWT: string };

      if (response.success !== true) {
        setError(true);
        return;
      }

      localStorageSet("token", response["JWT"]);
      dispatch({ type: "LOG_IN" });
      navigate("/", { replace: true });
    } catch (e) {
      setLoading(false)
      dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
    }
  };

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t("login.welcome")}
        </Typography>
        <Collapse in={loginError} sx={{ mb: 2 }}>
          <Alert
            variant="outlined"
            severity="error"
            onClose={() => setError(false)}
          >
            {t("login.loginError")}
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
    </FormContainer>
  );
};

export default LoginView;
