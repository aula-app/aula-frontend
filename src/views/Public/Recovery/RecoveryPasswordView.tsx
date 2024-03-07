import { SyntheticEvent, useCallback, useState } from 'react';
import { TextField, Typography, Stack } from '@mui/material';
import { AppButton, AppAlert, AppForm } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer, useForm } from 'react-hook-form-mui';


const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

interface Props {
  email?: string;
}

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const RecoveryPasswordView = ({ email = '' }: Props) => {
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
          Password Recovery
        </Typography>
        <TextField
          required
          label="Email"
          {...register('email')}
          error={errors.email ? true : false}
          helperText={errors.email?.message || ' '}
        />
        <AppButton type="submit" onClick={handleSubmit(onSubmit)} sx={{ mx: 0 }}>
          Recover
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default RecoveryPasswordView;
