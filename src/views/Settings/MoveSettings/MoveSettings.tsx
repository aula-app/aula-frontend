import { BoxType, RoomType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import DataConfig from '@/utils/Data';
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

  const currentTarget = DataConfig[scope].requests.move || null;

  const getDestination = async () => {
    if (!currentTarget) return;

    const requestId = [];
    if (currentTarget.target === 'ideas' || currentTarget.target === 'boxes') requestId.push('user_id');

    await databaseRequest(
      {
        model: DataConfig[currentTarget.target].requests.model,
        method: DataConfig[currentTarget.target].requests.fetch,
        arguments: {
          offset: 0,
          limit: 0,
        },
      },
      requestId
    ).then((response) => {
      setDestinationList(
        response.data.map((r: BoxType | RoomType) => ({ value: r.id, label: 'room_name' in r ? r.room_name : r.name }))
      );
    });
  };

  const request = async (id: number, targetId: number) => {
    if (!currentTarget || !targetId) return;
    await databaseRequest(
      {
        model: DataConfig[scope].requests.model,
        method: DataConfig[scope].requests.add,
        arguments: {
          [DataConfig[scope].requests.id]: id,
          [currentTarget.targetId]: targetId,
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
      <DialogTitle id="alert-dialog-title">{t('texts.move', { var: t(`views.${scope}`) })}</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <DialogContentText component={Stack} id="alert-dialog-description">
          {t('texts.moveData', { var: t(`views.${scope}`).toLowerCase() })}
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
                  label={currentTarget?.target}
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
