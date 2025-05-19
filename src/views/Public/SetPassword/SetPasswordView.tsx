import { AppIconButton } from '@/components';
import { checkPasswordKey, setPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Collapse, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

const SetPasswordView = () => {
  const { t } = useTranslation();
  const { key } = useParams();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  const [error, setError] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<keyof typeof fields, boolean>>({
    confirmPassword: false,
    newPassword: false,
  });

  const [isValid, setValid] = useState(true);

  const schema = yup
  .object({
    newPassword: yup
      .string()
      .required(t('forms.validation.required'))
      .min(4, t('forms.validation.minLength', { var: 4 }))
      .max(32, t('forms.validation.maxLength', { var: 32 })),
    confirmPassword: yup
      .string()
      .required(t('forms.validation.required'))
      .oneOf([yup.ref('newPassword')], t('forms.validation.passwordMatch')),
  })
  .required(t('forms.validation.required'));

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
});

// Infer TypeScript type from the Yup schema
type SchemaType = yup.InferType<typeof schema>;
const fields = schema.fields;

  const validateKey = async () => {
    if (!key) {
      setValid(false);
      return;
    }

    try {
      const response = await checkPasswordKey(
        key,
      );
      if (response.error) {
        setValid(false);
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      setValid(false);
    }
  };

    const onSubmit = async (data: SchemaType) => {
      if (!key)
        return

      const result = await setPassword(data.newPassword, key)

      if (result.error) {
        setError(t(result.error));
        return;
      }

      dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.success'), type: 'success' } });
      navigate("/", { replace: true });
    };

    const resetFields = () => {
      reset();
      setShowPassword({
        confirmPassword: false,
        newPassword: false,
      });
    };

  useEffect(() => {
    validateKey();
  }, [key, dispatch, t]);

  return (
    <FormContainer>
      <Stack gap={2}>
        <Typography variant="h2">{t('auth.password.set')}</Typography>
        <Collapse in={!isValid}>
          <Alert variant="outlined" severity="error" onClose={() => setValid(true)}>
            {t('errors.invalidCode')}
          </Alert>
        </Collapse>
        <FormContainer>
      <Stack gap={2}>
        <Stack gap={1} direction="row" flexWrap="wrap">
          {(Object.keys(fields) as Array<keyof typeof fields>).map((field) => (
            <TextField
              key={field}
              required
              type={showPassword[field] ? 'text' : 'password'}
              label={t(`auth.password.${field}`)}
              id={`set-password-${field}`}
              sx={{ flex: 1, minWidth: 'min(100%, 200px)' }}
              {...register(field)}
              error={!!errors[field]}
              helperText={`${errors[field]?.message || ''}`}
              slotProps={{
                htmlInput: {
                  'aria-labelledby': `set-password-${field}-label`,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIconButton
                        aria-label="toggle password visibility"
                        icon={showPassword[field] ? 'visibilityOn' : 'visibilityOff'}
                        title={showPassword[field] ? t('actions.hide') : t('actions.show')}
                        onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })}
                      />
                    </InputAdornment>
                  ),
                },
                inputLabel: {
                  id: `set-password-${field}-label`,
                  htmlFor: `set-password-${field}`
                }
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" justifyContent="end" gap={2}>
          <Collapse in={showMessage}>
            <Alert
              variant="outlined"
              severity={!error ? 'success' : 'error'}
              onClose={() => setShowMessage(false)}
            >
              {!error ? t('auth.password.success') : t('errors.invalidPassword')}
            </Alert>
          </Collapse>
          <Button 
            color="error" 
            onClick={resetFields}
            aria-label={t('actions.cancel')}
          >
            {t('actions.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit(onSubmit)}
            aria-label={t('actions.save')}
          >
            {t('actions.save')}
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
      </Stack>
    </FormContainer>
  );
};

export default SetPasswordView;
