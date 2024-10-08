import { AppIcon } from '@/components';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  email: string;
  order: number;
}

/** * Renders "Config" view
 * url: /settings/config
 */
const ResetPassword = ({ email, order, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const jwt_token = localStorageGet('token');
  const [openReset, setOpenReset] = useState(false);

  const requestPassword = async () => {
    if (!email) return;
    try {
      const response = await (
        await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/forgot_password.php?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
        })
      ).json();

      response.success
        ? dispatch({ type: 'ADD_POPUP', message: { message: t('texts.forgotRequest'), type: 'success' } })
        : dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
    } catch (e) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
    }

    setOpenReset(false);
  };

  return (
    <Stack order={order}>
      <Button variant="outlined" color="error" onClick={() => setOpenReset(true)} fullWidth sx={{ mb: 3 }}>
        {t('login.passwordReset')}
      </Button>
      <Dialog
        open={openReset}
        onClose={() => setOpenReset(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('login.passwordReset')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('texts.resetPasswordText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReset(false)} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={requestPassword} color="error" variant="contained">
            {t('generics.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ResetPassword;
