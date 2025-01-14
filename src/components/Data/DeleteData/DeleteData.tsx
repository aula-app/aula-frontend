import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import DataConfig from '@/utils/Data';
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
    await databaseRequest(
      {
        model: DataConfig[scope].requests.model,
        method: DataConfig[scope].requests.delete,
        arguments: { [DataConfig[scope].requests.id]: id },
      },
      ['updater_id']
    ).then(onClose);
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
          <WarningAmber sx={{ mr: 1 }} color="error" /> {t('delete.headline', { var: t(`scopes.${scope}.name`) })}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText id="alert-dialog-description">
          {t('delete.confirm', { var: t(`scopes.${scope}.name`) })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          {t('actions.cancel')}
        </Button>
        <Button onClick={deleteRequest} color="error" variant="contained">
          {t('actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteData;
