import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Collapse, InputAdornment, Stack, TextField } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormContainer, SubmitHandler, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AppIconButton from '../AppIconButton';
import AppButton from '../AppButton';

interface Props {
  hideOld?: boolean;
  disabled?: boolean;
  onSubmit: SubmitHandler<any>;
}

export interface ChangePasswordMethods {
  displayMessage: (isSuccess: boolean) => void;
}

/**
 * Renders User info with Avatar
 * @component ChangePassword
 */
const ChangePassword = forwardRef<ChangePasswordMethods, Props>(
  ({ onSubmit, disabled = false, hideOld = false }: Props, ref) => {
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
            {messageType === 'success' ? t('auth.password.success') : t('auth.errors.invalidPassword')}
          </Alert>
        </Collapse>
        <Stack>
          {!hideOld && (
            <TextField
              required
              disabled={disabled}
              type={showOldPassword ? 'text' : 'password'}
              label={t('auth.password.label')}
              sx={{ width: '100%' }}
              {...register('oldPassword')}
              error={errors.oldPassword ? true : false}
              helperText={errors.oldPassword?.message || ' '}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIconButton
                        aria-label="toggle password visibility"
                        icon={showOldPassword ? 'visibilityOn' : 'visibilityOff'}
                        title={showOldPassword ? t('actions.hide') : t('actions.show')}
                        onClick={() => setOldPassword(!showOldPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          <TextField
            required
            disabled={disabled}
            type={showNewPassword ? 'text' : 'password'}
            label={t('auth.password.change')}
            sx={{ width: '100%' }}
            {...register('newPassword')}
            error={errors.newPassword ? true : false}
            helperText={errors.newPassword?.message || ' '}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
                      icon={showNewPassword ? 'visibilityOn' : 'visibilityOff'}
                      title={showNewPassword ? t('actions.hide') : t('actions.show')}
                      onClick={() => setNewPassword(!showNewPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            required
            disabled={disabled}
            type={showConfirmPassword ? 'text' : 'password'}
            label={t('auth.password.confirm')}
            sx={{ width: '100%' }}
            {...register('confirmPassword')}
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword?.message || ' '}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
                      icon={showConfirmPassword ? 'visibilityOn' : 'visibilityOff'}
                      title={showConfirmPassword ? t('actions.hide') : t('actions.show')}
                      onClick={() => setConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <AppButton disabled={disabled} onClick={handleSubmit(onSubmit)} />
        </Stack>
      </FormContainer>
    );
  }
);

export default ChangePassword;
