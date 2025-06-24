import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { addMessage } from '@/services/messages';
import { UserType } from '@/types/Scopes';
import { errorAlert, successAlert } from '@/utils';

interface Props {
  user: UserType;
  onReload: () => void;
}

/**
 * Renders data export button
 * @component DataDelete
 */
const DataDelete: React.FC<Props> = ({ user, onReload }) => {
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [, dispatch] = useAppStore();

  const requestDelete = async () => {
    await addMessage({
      msg_type: 6,
      headline: `${t('requests.deleteAccount.title', { var: user.displayname })}`,
      body: `
---
type: deleteAccount
id: ${user.hash_id}
realname: ${user.realname}
username: ${user.username}
displayname: ${user.displayname}
email: ${user.email}
---
${t('requests.deleteAccount.body', { var: user.displayname })}`,
    }).then((response) => {
      if (response.error) {
        errorAlert(t(response.error), dispatch);
        return;
      }
      successAlert(t('requests.changeName.request'), dispatch);
      onReload();
    });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h3">{t('settings.account.delete')}</Typography>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpenDelete(true)}
        fullWidth
        data-testid="request-account-deletion-button"
        aria-label={t('requests.deleteAccount.button')}
      >
        {t('requests.deleteAccount.button')}
      </Button>
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography color="error" sx={{ display: 'flex' }}>
            <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('requests.deleteAccount.button')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('requests.deleteAccount.confirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            color="secondary"
            autoFocus
            data-testid="cancel-account-deletion-button"
            aria-label={t('actions.cancel')}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={requestDelete}
            color="error"
            variant="contained"
            data-testid="confirm-account-deletion-button"
            aria-label={t('actions.delete')}
          >
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DataDelete;
