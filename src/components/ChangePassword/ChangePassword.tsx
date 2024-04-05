import { useState } from 'react';
import { InputAdornment, Stack, TextField } from '@mui/material';
import AppIconButton from '../AppIconButton';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer, useForm } from 'react-hook-form-mui';
import AppButton from '../AppButton';

const schema = yup
  .object({
    currentPassword: yup.string().required().min(4).max(32),
    newPassword: yup.string().required().min(4).max(32),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  })
  .required();

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserInfo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData: Object) => console.log(formData);

  const [showCurrentPassword, setCurrentPassword] = useState(false);
  const [showNewPassword, setNewPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  return (
    <FormContainer>
      <Stack>
        <TextField
          required
          type={showCurrentPassword ? 'text' : 'password'}
          label="Current Password"
          sx={{ width: '100%' }}
          {...register('currentPassword')}
          error={errors.currentPassword ? true : false}
          helperText={errors.currentPassword?.message || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showCurrentPassword ? 'visibilityon' : 'visibilityoff'}
                  title={showCurrentPassword ? 'Hide Password' : 'Show Password'}
                  onClick={() => setCurrentPassword(!showCurrentPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </InputAdornment>
            ),
          }}
        />
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
          Change Password
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default UserInfo;
