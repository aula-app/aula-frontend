import { changePassword } from '@/services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Collapse, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AppIconButton from '../AppIconButton';
import { setPassword } from '@/services/login';
import { useParams } from 'react-router-dom';

interface Props {
  disabled?: boolean;
}

export interface ChangePasswordMethods {
  displayMessage: (isSuccess: boolean) => void;
}

/**
 * Renders User info with Avatar
 * @component ChangePassword
 */
const ChangePassword: React.FC<Props> = ({ disabled = false }) => {
  const { t } = useTranslation();
  const { key } = useParams();
  const [showMessage, setShowMessage] = useState(false);
  const [messageSuccess, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<keyof typeof fields, boolean>>({
    oldPassword: false,
    confirmPassword: false,
    newPassword: false,
  });

  const schema = yup
    .object({
      oldPassword: key
        ? yup.string().notRequired()
        : yup
            .string()
            .required(t('forms.validation.required'))
            .min(4, t('forms.validation.minLength', { var: 4 }))
            .max(32, t('forms.validation.maxLength', { var: 32 })),
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

  const onSubmit = async (data: SchemaType) => {
    const result = key
      ? await setPassword(data.newPassword, key)
      : await changePassword(data.oldPassword as 'string', data.newPassword);

    setSuccess(!result.error);
  };

  const resetFields = () => {
    reset();
    setShowPassword({
      oldPassword: false,
      confirmPassword: false,
      newPassword: false,
    });
  };

  return (
    <FormContainer>
      <Stack gap={2} mt={2}>
        <Typography variant="h6">{t('auth.password.change')}</Typography>
        <Stack gap={1} direction="row" flexWrap="wrap">
          {(Object.keys(fields) as Array<keyof typeof fields>).map((field) => (
            <TextField
              key={field}
              required
              disabled={disabled}
              type={showPassword[field] ? 'text' : 'password'}
              label={t(`auth.password.${field}`)}
              sx={{ flex: 1, minWidth: 'min(100%, 200px)' }}
              {...register(field)}
              error={!!errors[field]}
              helperText={errors[field]?.message}
              slotProps={{
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
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" justifyContent="end" gap={2}>
          <Collapse in={showMessage}>
            <Alert
              variant="outlined"
              severity={messageSuccess ? 'success' : 'error'}
              onClose={() => setShowMessage(false)}
            >
              {messageSuccess ? t('auth.password.success') : t('auth.errors.invalidPassword')}
            </Alert>
          </Collapse>
          <Button color="error" disabled={disabled} onClick={resetFields}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained" disabled={disabled} onClick={handleSubmit(onSubmit)}>
            {t('actions.save')}
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};

export default ChangePassword;
