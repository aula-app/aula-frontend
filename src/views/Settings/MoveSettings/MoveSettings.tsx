import { DatabaseResponseData } from '@/types/Generics';
import { BoxType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, getRequest, requestDefinitions } from '@/utils';
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
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

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
  const scope = setting_name as SettingNamesType;

  const handleChange = (event: SelectChangeEvent) => {
    setDestination(event.target.value);
  };

  const getDestination = async () => {
    if (!Object.hasOwn(requestDefinitions[scope], 'isChild')) return;
    await databaseRequest({
      model: requestDefinitions[requestDefinitions[scope].isChild].model,
      method: getRequest(requestDefinitions[scope].isChild, 'fetch'),
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response: DatabaseResponseData) =>
      setDestinationList(response.data.map((r: BoxType) => ({ value: r.id, label: r.name })))
    );
  };

  const request = async (id: number) => {
    if (!requestDefinitions[scope].isChild) return;
    await databaseRequest(
      {
        model: requestDefinitions[scope].model,
        method: getRequest(requestDefinitions[scope].isChild, 'move'),
        arguments: {
          [getRequest(scope, 'id')]: id,
          [getRequest(requestDefinitions[scope].isChild, 'id')]: destination,
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
              label={requestDefinitions[scope].isChild}
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
