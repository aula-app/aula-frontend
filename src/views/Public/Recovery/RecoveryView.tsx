import { TextField, Typography, Stack } from '@mui/material';
import { AppButton } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 */
const RecoveryPasswordView = () => {
  const { t } = useTranslation();

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

  const onSubmit = (formData: Object) => console.log(formData)

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('login.recovery')}
        </Typography>
        <TextField
          required
          label="Email"
          {...register('email')}
          error={errors.email ? true : false}
          helperText={errors.email?.message || ' '}
        />
        <AppButton type="submit" onClick={handleSubmit(onSubmit)} sx={{ mx: 0 }}>
          {t('login.recover')}
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default RecoveryPasswordView;
