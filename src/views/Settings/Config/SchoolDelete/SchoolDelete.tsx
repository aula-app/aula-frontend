import { AppIcon } from '@/components';
import { useEventLogout } from '@/hooks';
import { useAppStore } from '@/store';
import { databaseRequest } from '@/utils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const SchoolDelete = () => {
  const { t } = useTranslation();
  const onLogout = useEventLogout();
  const [, dispatch] = useAppStore();
  const [openDelete, setOpenDelete] = useState(false);

  const lockInstance = async () => {
    await databaseRequest(
      {
        model: 'Settings',
        method: 'setInstanceOnlineMode',
        arguments: { status: 5 },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) onLogout();
    });
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} fullWidth>
        {t('texts.deleteData')}
      </Button>
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('texts.deleteData')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('texts.deleteText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={lockInstance} color="error" variant="contained">
            {t('generics.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SchoolDelete;
