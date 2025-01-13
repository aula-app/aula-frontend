import { useAppStore } from '@/store';
import { Button, CircularProgress, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { validateInstanceCode } from '@/services/instance';

const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError(t('generics.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await validateInstanceCode(code.trim());
      if (isValid) {
        navigate('/');
      } else {
        setError(t('generics.wrong'));
        dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
      }
    } catch (err) {
      setError(t('generics.error'));
      dispatch({ type: 'ADD_POPUP', message: { message: t('generics.error'), type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 400, margin: '0 auto', p: 2 }}>
      <TextField
        disabled={isLoading}
        id="instance-code"
        label={t('code')}
        variant="outlined"
        error={!!error}
        helperText={error || t('type_instance_code')}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') handleSubmit();
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCode(event.target.value);
          if (error) setError('');
        }}
      />
      <Button
        disabled={isLoading}
        variant="contained"
        onClick={handleSubmit}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {t("confirm")}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
