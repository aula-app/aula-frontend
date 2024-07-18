import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { databaseRequest, getRequest, requestDefinitions } from '@/utils';
import { WarningAmber } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Params = {
  isOpen: boolean;
  scope: SettingNamesType;
  id: number | number[];
  onClose: () => void;
};
/** * Renders "Settings" alert dialog component view
 * url: /settings/:setting_name/
 */
const DeleteData = ({ isOpen, scope, id, onClose }: Params) => {
  const { t } = useTranslation();

  const request = async (id: number) => {
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'delete'),
      arguments: { [getRequest(scope, 'id')]: id },
    }).then(onClose);
  };

  const deleteRequest = () => {
    typeof id === 'number' ? request(id) : id.forEach((item) => request(item));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          <WarningAmber sx={{ mr: 1 }} color="error" /> {t('texts.deleteHeadline', { var: scope })}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText id="alert-dialog-description">{t('texts.deleteConfirm', { var: scope })}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          {t('generics.cancel')}
        </Button>
        <Button onClick={deleteRequest} color="error" variant="contained">
          {t('generics.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteData;
