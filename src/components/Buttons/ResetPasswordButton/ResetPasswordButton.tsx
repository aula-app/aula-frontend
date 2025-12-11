import AppIcon from '@/components/AppIcon';
import { resetUserPassword } from '@/services/users';
import { useAppStore } from '@/store';
import { UserType } from '@/types/Scopes';
import {
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FC, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ChipProps {
  target: UserType;
  hasEmail?: boolean;
  onSuccess?: () => void;
}

const ResetPasswordButton: FC<Props> = ({ target, hasEmail = false, onSuccess, ...restOfProps }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [confirm, setConfirm] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const openDialog = (event: SyntheticEvent) => {
    event.stopPropagation();
    setConfirm(true);
  };

  const closeDialog = (event: SyntheticEvent) => {
    event.stopPropagation();
    setConfirm(false);
  };

  const handleReset = async (event: SyntheticEvent) => {
    event.stopPropagation();
    if (!target.hash_id) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
      return;
    }

    try {
      // This request does not work yet – waiting for backend implementation
      const response = await resetUserPassword(target.hash_id);

      if (response.error) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
      } else {
        dispatch({
          type: 'ADD_POPUP',
          message: {
            message: t('auth.forgotPassword.successfulUser', {
              user: target.realname || target.displayname,
              var: hasEmail ? t('auth.forgotPassword.successfulEmail') : t('auth.forgotPassword.successfulNoEmail'),
            }),
            type: 'success',
          },
        });
        if (hasEmail) {
          setPasswordResetSent(true);
        }
        onSuccess?.();
      }
    } catch {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
    }

    setConfirm(false);
  };

  return (
    <>
      <Chip
        className="noPrint"
        sx={{ width: '100%', justifyContent: 'space-between', px: 1 }}
        label={!passwordResetSent ? t('auth.forgotPassword.button') : '…' + t('auth.forgotPassword.buttonSent')}
        onClick={openDialog}
        icon={<AppIcon icon={!passwordResetSent ? 'resetPassword' : 'check'} size="small" />}
        disabled={passwordResetSent}
        {...restOfProps}
      />
      <Dialog
        open={confirm}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        aria-modal="true"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} aria-hidden="true" /> {t('auth.forgotPassword.button')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('auth.forgotPassword.message', {
              var: hasEmail ? t('auth.forgotPassword.messageEmail') : t('auth.forgotPassword.messageNoEmail'),
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" autoFocus tabIndex={0} aria-label={t('actions.cancel')}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleReset} variant="contained" tabIndex={0} aria-label={t('actions.confirm')}>
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ResetPasswordButton.displayName = 'ResetPasswordButton';

export default ResetPasswordButton;
