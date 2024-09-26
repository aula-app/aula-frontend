import { AppIcon, AppIconButton } from '@/components';
import { useAppStore } from '@/store';
import { RequestBodyType, UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  user: UserType;
  option: 'email' | 'realname' | 'username';
}

/** * Renders "requests" view
 * url: /settings/requests
 */
const RestrictedField = ({ user, option }: Props) => {
  const { t } = useTranslation();
  const [locked, setLocked] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [, dispatch] = useAppStore();

  const currentField = String(user[option]);

  const { setValue, handleSubmit, control } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        [option]:
          option === 'email'
            ? yup.string().email('validation.email').required('validation.required')
            : yup.string().min(4, 'validation.min').max(50, 'validation.max').required('validation.required'),
      })
    ),
  });

  const closeConfirm = () => {
    setLocked(true);
    setConfirm(false);
    setValue(option, String(user[option]));
  };

  const sendMessage = async (headline: string, body: RequestBodyType, returnMessage: string) =>
    await databaseRequest(
      {
        model: 'Message',
        method: 'addMessage',
        arguments: { headline, body: JSON.stringify(body), msg_type: 5 },
      },
      ['creator_id', 'updater_id']
    ).then((response) => {
      if (!response.success) return;
      closeConfirm();
      dispatch({ type: 'ADD_POPUP', message: { message: returnMessage, type: 'success' } });
    });

  const onSubmit = (value: Record<typeof currentField, string>) => {
    if (!user) return;
    sendMessage(
      `Data change request for ${user.realname}`,
      {
        type: 'changeName',
        data: { id: user.id, property: option, from: String(user[option]), to: value[option] },
        content: `A data change procedure was requested for user ${user.realname}. They want to change their ${option} to ${value[option]}`,
      },
      t('texts.updateRequest')
    );
  };

  return (
    <Stack direction="row" alignItems="start" width="100%" gap={2}>
      <Controller
        // @ts-ignore
        name={option}
        control={control}
        // @ts-ignore
        defaultValue={user[option]}
        // @ts-ignore
        render={({ field, fieldState }) => (
          <TextField
            label={t(`settings.${option}`)}
            variant="filled"
            size="small"
            required
            disabled={locked}
            fullWidth
            {...field}
            error={!!fieldState.error}
            helperText={t(fieldState.error?.message || ' ')}
            slotProps={{ inputLabel: { shrink: !!field.value } }}
          />
        )}
      />
      {locked ? (
        <AppIconButton color="secondary" icon="edit" sx={{ mt: 0.5 }} onClick={() => setLocked(false)} />
      ) : (
        <AppIconButton color="primary" icon="check" sx={{ mt: 0.5 }} onClick={() => setConfirm(true)} />
      )}
      <Dialog
        open={confirm}
        onClose={closeConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('texts.dataUpdate')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('texts.dataUpdateText', { var: option })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="error" variant="contained">
            {t('generics.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default RestrictedField;
