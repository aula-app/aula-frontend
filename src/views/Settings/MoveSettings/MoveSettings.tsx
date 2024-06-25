import { BoxType } from '@/types/BoxTypes';
import { SingleResponseType } from '@/types/Generics';
import { databaseRequest, localStorageGet, parseJwt, SettingsConfig } from '@/utils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
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
const EditSettings = ({ isOpen, items, closeMethod, reloadMethod }: Params) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const { setting_name } = useParams();
  const [destination, setDestination] = useState<string>();
  const [destinationList, setDestinationList] = useState<{ value: number; label: string }[]>([]);
  const currentSetting = setting_name as keyof typeof SettingsConfig;

  const handleChange = (event: SelectChangeEvent) => {
    setDestination(event.target.value);
  };

  const getDestination = async () => {
    if(!Object.hasOwn(SettingsConfig[currentSetting], 'isChild')) return;
    await databaseRequest('model', {
      model: SettingsConfig[SettingsConfig[currentSetting].isChild].model,
      method: SettingsConfig[SettingsConfig[currentSetting].isChild].requests.fetch,
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response: SingleResponseType) =>
      setDestinationList(response.data.map((r: BoxType) => ({ value: r.id, label: r.name })))
    )};

  const request = async (id: number) => {
    if(!Object.hasOwn(SettingsConfig[currentSetting].requests, 'move')) return;
    await databaseRequest('model', {
      model: SettingsConfig[currentSetting].model,
      method: SettingsConfig[currentSetting].requests.move,
      arguments: {
        [`${SettingsConfig[currentSetting].model.toLowerCase()}_id`]: id,
        [`${SettingsConfig[SettingsConfig[currentSetting].isChild].model.toLowerCase()}_id`]: destination,
        updater_id: jwt_payload.user_id
      },
    });
  };

  const moveRequest = () => {
    items.forEach((item) => request(item));
    reloadMethod();
    closeMethod();
  };

  useEffect(() => {
    getDestination();
  }, [setting_name]);

  return (
    <Dialog
      open={isOpen}
      onClose={closeMethod}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          Move selected {setting_name}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText id="alert-dialog-description">
          <Stack>
            Where do you want do move this {setting_name}?
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <Select
                id="demo-simple-select"
                value={destination}
                label={SettingsConfig[currentSetting].isChild}
                disabled={destinationList.length === 0}
                fullWidth
                onChange={handleChange}
              >
                {destinationList.map((destinationItem) => (
                  <MenuItem key={destinationItem.value} value={destinationItem.value}>
                    {destinationItem.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeMethod} color="secondary" autoFocus>
          Cancel
        </Button>
        <Button onClick={moveRequest} color="primary" variant="contained">
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSettings;
