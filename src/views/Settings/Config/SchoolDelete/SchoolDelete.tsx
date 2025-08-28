import { AppIcon } from '@/components';
import { useEventLogout } from '@/hooks';
import { setInstanceOnlineMode } from '@/services/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const SchoolDelete = () => {
  const { t } = useTranslation();
  const onLogout = useEventLogout();
  const [openDelete, setOpenDelete] = useState(false);

  const lockInstance = async () => {
    const response = await setInstanceOnlineMode(5);
    if (response.data) onLogout();
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpenDelete(true)}
        fullWidth
        data-testid="delete-account-button"
      >
        {t('settings.account.delete')}
      </Button>
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('settings.account.delete')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('settings.account.deleteText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary" autoFocus data-testid="cancel-button">
            {t('actions.cancel')}
          </Button>
          <Button onClick={lockInstance} color="error" variant="contained" data-testid="lock-button">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SchoolDelete;
