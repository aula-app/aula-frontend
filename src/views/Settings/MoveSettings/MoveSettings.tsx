import { BoxType } from '@/types/scopes/BoxTypes';
import { SingleResponseType } from '@/types/Generics';
import { databaseRequest, SettingsConfig } from '@/utils';
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Params = {
  isOpen: boolean;
  items: number[];
  onClose: () => void;
};
/** * Renders "Settings" alert dialog component view
 * url: /settings/:setting_name/
 */
const EditSettings = ({ isOpen, items, onClose }: Params) => {
  const { t } = useTranslation();
  const { setting_name } = useParams();
  const [destination, setDestination] = useState<string>();
  const [destinationList, setDestinationList] = useState<{ value: number; label: string }[]>([]);
  const currentSetting = setting_name as keyof typeof SettingsConfig;

  const handleChange = (event: SelectChangeEvent) => {
    setDestination(event.target.value);
  };

  const getDestination = async () => {
    if (!Object.hasOwn(SettingsConfig[currentSetting], 'isChild')) return;
    await databaseRequest({
      model: SettingsConfig[SettingsConfig[currentSetting].isChild].model,
      method: SettingsConfig[SettingsConfig[currentSetting].isChild].requests.fetch,
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response: SingleResponseType) =>
      setDestinationList(response.data.map((r: BoxType) => ({ value: r.id, label: r.name })))
    );
  };

  const request = async (id: number) => {
    if (!SettingsConfig[currentSetting].requests.move) return;
    await databaseRequest(
      {
        model: SettingsConfig[currentSetting].model,
        method: SettingsConfig[currentSetting].requests.move,
        arguments: {
          [`${SettingsConfig[currentSetting].model.toLowerCase()}_id`]: id,
          [`${SettingsConfig[SettingsConfig[currentSetting].isChild].model.toLowerCase()}_id`]: destination,
        },
      },
      ['updater_id']
    );
  };

  const moveRequest = () => {
    items.forEach((item) => request(item));
    onClose();
  };

  useEffect(() => {
    getDestination();
  }, [setting_name]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Move selected {setting_name}</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText component={Stack} id="alert-dialog-description">
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          {t('generics.cancel')}
        </Button>
        <Button onClick={moveRequest} color="primary" variant="contained">
          {t('generics.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSettings;
