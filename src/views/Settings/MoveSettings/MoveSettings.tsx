import { BoxType, RoomType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, scopeDefinitions } from '@/utils';
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
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
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
  const [destinationList, setDestinationList] = useState<{ value: number; label: string }[]>([]);

  const { control, handleSubmit } = useForm();
  const scope = setting_name as SettingNamesType;

  const getDestination = async () => {
    if (!scopeDefinitions[scope].isChild) return;
    await databaseRequest({
      model: scopeDefinitions[scopeDefinitions[scope].isChild].model,
      method: scopeDefinitions[scope].fetch,
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response) => {
      setDestinationList(
        response.data.map((r: BoxType | RoomType) => ({ value: r.id, label: 'room_name' in r ? r.room_name : r.name }))
      );
    });
  };

  const request = async (id: number, targetId: number) => {
    if (!scopeDefinitions[scope].move || !targetId) return;
    await databaseRequest(
      {
        model: scopeDefinitions[scope].model,
        method: scopeDefinitions[scope].add,
        arguments: {
          [scopeDefinitions[scope].id]: id,
          [scopeDefinitions[scope].move.targetId]: targetId,
        },
      },
      ['updater_id']
    );
  };

  const moveRequest = (formData: FieldValues) => {
    items.forEach((item) => request(item, formData.select));
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
      <DialogTitle id="alert-dialog-title">{t('texts.move', { var: t(`views.${setting_name}`) })}</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText component={Stack} id="alert-dialog-description">
          {t('texts.moveData', { var: t(`views.${setting_name}`).toLowerCase() })}
          <Controller
            // @ts-ignore
            name="select"
            control={control}
            // @ts-ignore
            defaultValue={0}
            render={({ field, fieldState }) => (
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <Select
                  id="demo-simple-select"
                  label={scopeDefinitions[scope].isChild}
                  disabled={destinationList.length === 0}
                  fullWidth
                  // @ts-ignore
                  {...field}
                  // @ts-ignore
                  error={!!fieldState.error}
                >
                  {destinationList.map((destinationItem) => (
                    <MenuItem key={destinationItem.value} value={destinationItem.value}>
                      {destinationItem.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          {t('generics.cancel')}
        </Button>
        <Button onClick={handleSubmit(moveRequest)} color="primary" variant="contained">
          {t('generics.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSettings;
