import { AppIcon } from '@/components';
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
  const [openDelete, setOpenDelete] = useState(false);

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
        <DialogTitle id="alert-dialog-title">
          <Typography color="error" sx={{ display: 'flex' }}>
            <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('texts.deleteData')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('texts.deleteText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={() => setOpenDelete(false)} color="error" variant="contained">
            {t('generics.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SchoolDelete;
