import AppSubmitButton from '@/components/AppSubmitButton';
import { recoverPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
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
    email: yup.string().email(t('validation.email')).required(t('validation.required')),
  });

  const form = useForm<FormData>({
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
        dispatch({ type: 'ADD_POPUP', message: { message: t('login.forgotRequest'), type: 'success' } });
        navigate('/', { replace: true });
      } else {
        dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return (
    <FormContainer onSuccess={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5">{t('login.recovery')}</Typography>
        <TextField
          required
          disabled={isLoading}
          label="Email"
          {...form.register('email')}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message || ' '}
        />
        <AppSubmitButton label={t('login.recover')} disabled={isLoading} />
      </Stack>
    </FormContainer>
  );
};

export default RecoveryPasswordView;
