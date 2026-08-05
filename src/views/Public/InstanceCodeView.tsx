import { useAppStore } from '@/store';
import { Button, CircularProgress, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateAndSaveInstanceCode } from '@/services/instance';

const InstanceCodeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError(t('forms.validation.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await validateAndSaveInstanceCode(code.trim());
      if (isValid) {
        // Resume an IdP-initiated SSO hand-off (e.g. Eduplaces marketplace)
        // if the guard redirect carried `via=eduplaces` into the URL.
        if (searchParams.get('via') === 'eduplaces') {
          const resume = new URLSearchParams({ via: 'eduplaces' });
          const hint = searchParams.get('login_hint');
          if (hint) resume.set('login_hint', hint);
          navigate(`/login?${resume.toString()}`);
          return;
        }
        navigate('/');
      } else {
        setError(t('errors.default'));
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      }
    } catch (err) {
      setError(t('instance.error'));
      dispatch({ type: 'ADD_POPUP', message: { message: t('instance.error'), type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 400, margin: '0 auto', p: 2 }}>
      <TextField
        disabled={isLoading}
        id="instance-code"
        data-testid="input-instance-code"
        name="instance-code"
        label={t('instance.label')}
        variant="outlined"
        error={!!error}
        helperText={error || t('instance.headline')}
        slotProps={{
          input: {
            autoCapitalize: "none"
          }
        }}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') handleSubmit();
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCode(event.target.value);
          if (error) setError('');
        }}
      />
      <Button
        data-testid="submit-instance-code"
        name="submit-instance-code"
        disabled={isLoading}
        variant="contained"
        onClick={handleSubmit}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {t('actions.confirm')}
      </Button>
    </Stack>
  );
};

export default InstanceCodeView;
