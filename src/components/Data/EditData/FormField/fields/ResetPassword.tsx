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
  const api_url = localStorageGet('api_url');
  const [openReset, setOpenReset] = useState(false);

  const requestPassword = async () => {
    if (!email) return;
    try {
      const response = await (
        await fetch(`${api_url}/api/controllers/forgot_password.php?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
        })
      ).json();

      response.success
        ? dispatch({ type: 'ADD_POPUP', message: { message: t('auth.forgotPassword.success'), type: 'success' } })
        : dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    } catch (e) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    }

    setOpenReset(false);
  };

  return (
    <Stack order={order}>
      <Button variant="outlined" color="error" onClick={() => setOpenReset(true)} fullWidth sx={{ mb: 3 }}>
        {t('auth.forgotPassword.button')}
      </Button>
      <Dialog
        open={openReset}
        onClose={() => setOpenReset(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('auth.forgotPassword.button')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('auth.forgotPassword.message')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReset(false)} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={requestPassword} color="error" variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ResetPassword;
