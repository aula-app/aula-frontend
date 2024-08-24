import { PassResponse } from '@/types/Generics';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AppButton from '../AppButton';
import AppIconButton from '../AppIconButton';

interface Props {
  hideOld?: boolean;
  onSubmit: (formData: PassResponse) => Promise<void>;
}

/**
 * Renders User info with Avatar
 * @component ChangePassword
 */
const ChangePassword = ({ onSubmit, hideOld = false }: Props) => {
  const { t } = useTranslation();
  const [showOldPassword, setOldPassword] = useState(false);
  const [showNewPassword, setNewPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  const schema = yup
    .object()
    .shape({
      newPassword: yup.string().required().min(4).max(32),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
    })
    .shape(
      hideOld
        ? {
            oldPassword: yup.string().required().min(4).max(32),
          }
        : {}
    )
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <FormContainer>
      <Stack>
        {!hideOld && (
          <TextField
            required
            type={showNewPassword ? 'text' : 'password'}
            label="Old Password"
            sx={{ width: '100%' }}
            {...register('oldPassword')}
            error={errors.oldPassword ? true : false}
            helperText={errors.oldPassword?.message || ' '}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showOldPassword ? 'visibilityon' : 'visibilityoff'}
                    title={showOldPassword ? 'Hide Password' : 'Show Password'}
                    onClick={() => setOldPassword(!showOldPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
        <TextField
          required
          type={showNewPassword ? 'text' : 'password'}
          label="New Password"
          sx={{ width: '100%' }}
          {...register('newPassword')}
          error={errors.newPassword ? true : false}
          helperText={errors.newPassword?.message || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showNewPassword ? 'visibilityon' : 'visibilityoff'}
                  title={showNewPassword ? 'Hide Password' : 'Show Password'}
                  onClick={() => setNewPassword(!showNewPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm New Password"
          sx={{ width: '100%' }}
          {...register('confirmPassword')}
          error={errors.confirmPassword ? true : false}
          helperText={errors.confirmPassword?.message || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showConfirmPassword ? 'visibilityon' : 'visibilityoff'}
                  title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </InputAdornment>
            ),
          }}
        />
        <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(onSubmit)}>
          {t('generics.confirm')}
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default ChangePassword;
