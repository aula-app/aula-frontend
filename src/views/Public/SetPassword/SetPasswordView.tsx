import ChangePassword from '@/components/ChangePassword';
import { checkPasswordKey } from '@/services/login';
import { useAppStore } from '@/store';
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

  const validateKey = async () => {
    if (!key) {
      setValid(false);
      return;
    }

    try {
      setLoading(true);
      const response = await checkPasswordKey(
        key,
      );
      if (response.error) {
        setValid(false);
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateKey();
  }, [key, dispatch, t]);

  return (
    <FormContainer>
      <Stack spacing={3}>
        <Typography variant="h5">{t('auth.password.set')}</Typography>
        <Collapse in={!isValid}>
          <Alert variant="outlined" severity="error" onClose={() => setValid(true)}>
            {t('errors.invalidCode')}
          </Alert>
        </Collapse>
        <ChangePassword disabled={isLoading} />
      </Stack>
    </FormContainer>
  );
};

export default SetPasswordView;
