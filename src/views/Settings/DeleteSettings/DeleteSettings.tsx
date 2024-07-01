import { databaseRequest, SettingsConfig } from '@/utils';
import { WarningAmber } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

type Params = {
  isOpen: boolean;
  items: number[];
  closeMethod: () => void;
  reloadMethod: () => void;
};
/** * Renders "Settings" alert dialog component view
 * url: /settings/:setting_name/
 */
const DeleteSettings = ({ isOpen, items, closeMethod, reloadMethod }: Params) => {
  const { setting_name } = useParams();

  const request = async (id: number) => {
    const currentSetting = setting_name as keyof typeof SettingsConfig;
    await databaseRequest('model', {
      model: SettingsConfig[currentSetting].model,
      method: SettingsConfig[currentSetting].requests.delete,
      arguments: {[`${SettingsConfig[currentSetting].model.toLowerCase()}_id`]: id},
    });
  }

  const deleteRequest = () => {
    items.forEach(item => request(item));
    reloadMethod();
    closeMethod();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closeMethod}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          <WarningAmber sx={{mr: 1}} color='error' /> Delete selected {setting_name}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the selected {setting_name}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeMethod} color="secondary" autoFocus>
          Cancel
        </Button>
        <Button onClick={deleteRequest} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSettings;
