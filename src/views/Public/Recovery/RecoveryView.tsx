import { AppButton } from '@/components';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { localStorageGet } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 */
const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet("token");
  const api_url = localStorageGet("api_url");
  const navigate = useNavigate()
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);

  const schema = yup.object({
    email: yup.string().email(t("validation.email")).required(t("validation.required")),
  })
  .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: ObjectPropByName) => {
    setLoading(true)
    const request = await fetch(
        `${api_url}/api/controllers/forgot_password.php?email=${formData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt_token,
          }}
      )

    const response = await request.json() as {success: boolean, JWT: string};
    setLoading(false)

    if (!response.success) {
      dispatch({ type: 'ADD_POPUP', message: {message: t('generics.wrong'), type: 'error'} });
      return;
    }

    dispatch({ type: 'ADD_POPUP', message: {message: t('login.forgotRequest'), type: 'error'} });
    navigate("/", { replace: true });
  }

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('login.recovery')}
        </Typography>
        <TextField
          required
          disabled={isLoading}
          label="Email"
          {...register('email')}
          error={errors.email ? true : false}
          helperText={errors.email?.message || ' '}
        />
        <AppButton type="submit" disabled={isLoading} onClick={handleSubmit(onSubmit)} sx={{ mx: 0 }}>
          {t('login.recover')}
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default RecoveryPasswordView;
