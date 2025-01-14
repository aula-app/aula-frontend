import ChangePassword from '@/components/ChangePassword';
import { checkPasswordKey, setPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { PassResponse } from '@/types/Generics';
import { localStorageGet } from '@/utils';
import { Alert, Collapse, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const SetPasswordView = () => {
  const { t } = useTranslation();
  const { key } = useParams();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const validateKey = async () => {
      if (!key) {
        setValid(false);
        return;
      }

      try {
        setLoading(true);
        const response = await checkPasswordKey(
          localStorageGet('api_url'),
          key,
          localStorageGet('token'),
          controller.signal
        );
        if (!response.success) {
          setValid(false);
        }
      } catch (error) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateKey();
    return () => controller.abort();
  }, [key, dispatch, t]);

  const onSubmit = async (formData: PassResponse) => {
    if (!key) return;

    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await setPassword(
        localStorageGet('api_url'),
        key,
        formData.newPassword,
        localStorageGet('token'),
        controller.signal
      );

      if (response.success) {
        navigate('/');
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
    <FormContainer>
      <Stack spacing={3}>
        <Typography variant="h5">{t('auth.password.set')}</Typography>
        <Collapse in={!isValid}>
          <Alert variant="outlined" severity="error" onClose={() => setValid(true)}>
            {t('auth.errors.invalidCode')}
          </Alert>
        </Collapse>
        <ChangePassword disabled={isLoading} onSubmit={onSubmit} hideOld />
      </Stack>
    </FormContainer>
  );
};

export default SetPasswordView;
