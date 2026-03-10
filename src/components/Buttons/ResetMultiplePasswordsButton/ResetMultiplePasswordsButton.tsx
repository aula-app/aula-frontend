import AppIcon from '@/components/AppIcon';
import { resetUserPassword } from '@/services/users';
import { useAppStore } from '@/store';
import { UserType } from '@/types/Scopes';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { forwardRef, SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  users?: UserType[];
  onSuccess?: () => Promise<void> | void;
}

const ResetMultiplePasswordsButton = forwardRef<HTMLButtonElement, Props>(
  ({ users = [], onSuccess, disabled = false, ...restOfProps }, ref) => {
    const { t } = useTranslation();
    const [, dispatch] = useAppStore();
    const [confirm, setConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const hasTargets = users.length > 0;
    const targetLabel = t(`scopes.users.${users.length === 1 ? 'name' : 'plural'}`);

    const emailStats = useMemo(
      () => ({
        withEmail: users.filter((user) => Boolean(user.email)).length,
        total: users.length,
      }),
      [users]
    );

    const dialogVariant = useMemo(() => {
      if (!emailStats.total) return t('auth.forgotPassword.messageNoEmail');
      if (emailStats.withEmail === emailStats.total) return t('auth.forgotPassword.messageEmail');
      if (emailStats.withEmail === 0) return t('auth.forgotPassword.messageNoEmail');
      return `${t('auth.forgotPassword.messageEmail')} / ${t('auth.forgotPassword.messageNoEmail')}`;
    }, [emailStats, t]);

    const buttonLabel = hasTargets
      ? `${t('auth.forgotPassword.button')} (${users.length})`
      : t('auth.forgotPassword.button');

    const dialogMessage =
      users.length > 1
        ? t('auth.forgotPassword.messageMultiple', {
            count: users.length,
            target: targetLabel,
            var: dialogVariant,
            defaultValue: 'Are you sure you want to request new passwords for {{count}} {{target}}? {{var}}',
          })
        : t('auth.forgotPassword.message', {
            var: dialogVariant,
          });

    const openDialog = (event: SyntheticEvent) => {
      event.stopPropagation();
      if (!hasTargets) return;
      setConfirm(true);
    };

    const closeDialog = (event?: SyntheticEvent) => {
      event?.stopPropagation();
      if (isProcessing) return;
      setConfirm(false);
    };

    const handleResetAll = async (event: SyntheticEvent) => {
      event.stopPropagation();
      if (!hasTargets || isProcessing) return;

      setIsProcessing(true);
      let hasSuccess = false;
      let hasError = false;

      try {
        const results = await Promise.all(
          users.map(async (user) => {
            if (!user.hash_id) {
              return { user, error: 'missing-hash' as const };
            }

            try {
              const response = await resetUserPassword(user.hash_id);
              if (response.error) {
                return { user, error: response.error };
              }
              return { user, error: null };
            } catch {
              return { user, error: 'request-failed' as const };
            }
          })
        );

        results.forEach(({ user, error }) => {
          if (error) {
            hasError = true;
            dispatch({
              type: 'ADD_POPUP',
              message: {
                message: `${t('errors.failed')} (${user.realname || user.displayname})`,
                type: 'error',
              },
            });
            return;
          }

          hasSuccess = true;
          const userHasEmail = Boolean(user.email);
          dispatch({
            type: 'ADD_POPUP',
            message: {
              message: t('auth.forgotPassword.successfulUser', {
                user: user.realname || user.displayname,
                var: t(userHasEmail ? 'auth.forgotPassword.successfulEmail' : 'auth.forgotPassword.successfulNoEmail'),
              }),
              type: 'success',
            },
          });
        });

        if (!hasSuccess && hasError) {
          dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
        }

        setConfirm(false);
      } finally {
        setIsProcessing(false);
      }

      if (hasSuccess) {
        await onSuccess?.();
      }
    };

    return (
      <>
        <Button
          ref={ref}
          variant="outlined"
          color="secondary"
          onClick={openDialog}
          disabled={disabled || !hasTargets || isProcessing}
          {...restOfProps}
        >
          <AppIcon icon="resetPassword" pr={1} />
          {buttonLabel}
        </Button>
        <Dialog
          open={confirm}
          onClose={closeDialog}
          aria-labelledby="reset-multiple-passwords-title"
          aria-describedby="reset-multiple-passwords-description"
          aria-modal="true"
        >
          <DialogTitle id="reset-multiple-passwords-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
            <AppIcon icon="alert" sx={{ mr: 1 }} aria-hidden="true" /> {t('auth.forgotPassword.button')}
          </DialogTitle>
          <DialogContent sx={{ overflowY: 'auto' }}>
            <DialogContentText id="reset-multiple-passwords-description">{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="secondary" autoFocus tabIndex={0} aria-label={t('actions.cancel')}>
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleResetAll}
              variant="contained"
              tabIndex={0}
              aria-label={t('actions.confirm')}
              disabled={isProcessing}
            >
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

ResetMultiplePasswordsButton.displayName = 'ResetMultiplePasswordsButton';

export default ResetMultiplePasswordsButton;
