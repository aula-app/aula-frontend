import { recoverPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

interface FormData {
  email: string;
}

const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email(t('forms.validation.email')).required(t('forms.validation.required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    const controller = new AbortController();

    try {
      const response = await recoverPassword(
        localStorageGet('api_url'),
        formData.email,
        localStorageGet('token'),
        controller.signal
      );

      if (response.success) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('auth.forgotPassword.success'), type: 'success' } });
        navigate('/', { replace: true });
      } else {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <Typography variant="h2">{t('auth.forgotPassword.recovery')}</Typography>
        <TextField
          required
          disabled={isLoading}
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={`${errors.email?.message || ''}`}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>{t('auth.forgotPassword.recover')}</Button>
      </Stack>
    </form>
  );
};

export default RecoveryPasswordView;
