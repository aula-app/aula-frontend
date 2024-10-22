import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Collapse, InputAdornment, Stack, TextField } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormContainer, SubmitHandler, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AppButton from '../AppButton';
import AppIconButton from '../AppIconButton';

interface Props {
  hideOld?: boolean;
  onSubmit: SubmitHandler<any>;
}

export interface ChangePasswordMethods {
  displayMessage: (isSuccess: boolean) => void;
}

/**
 * Renders User info with Avatar
 * @component ChangePassword
 */
const ChangePassword = forwardRef<ChangePasswordMethods, Props>(({ onSubmit, hideOld = false }: Props, ref) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [showMessage, setShowMessage] = useState(false);
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
        ? {}
        : {
            oldPassword: yup.string().required().min(4).max(32),
          }
    )
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    displayMessage(isSuccess: boolean) {
      setMessageType(isSuccess ? 'success' : 'error');
      setShowMessage(true);
    },
  }));

  return (
    <FormContainer>
      <Collapse in={showMessage} sx={{ mb: 2 }}>
        <Alert variant="outlined" severity={messageType} onClose={() => setShowMessage(false)}>
          {messageType === 'success' ? t('login.passwordChange') : t('login.passwordError')}
        </Alert>
      </Collapse>
      <Stack>
        {!hideOld && (
          <TextField
            required
            type={showOldPassword ? 'text' : 'password'}
            label={t('settings.password')}
            sx={{ width: '100%' }}
            {...register('oldPassword')}
            error={errors.oldPassword ? true : false}
            helperText={errors.oldPassword?.message || ' '}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showOldPassword ? 'visibilityOn' : 'visibilityOff'}
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
          label={t('settings.passwordChange')}
          sx={{ width: '100%' }}
          {...register('newPassword')}
          error={errors.newPassword ? true : false}
          helperText={errors.newPassword?.message || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showNewPassword ? 'visibilityOn' : 'visibilityOff'}
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
          label={t('settings.passwordConfirmChange')}
          sx={{ width: '100%' }}
          {...register('confirmPassword')}
          error={errors.confirmPassword ? true : false}
          helperText={errors.confirmPassword?.message || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showConfirmPassword ? 'visibilityOn' : 'visibilityOff'}
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
});

export default ChangePassword;
