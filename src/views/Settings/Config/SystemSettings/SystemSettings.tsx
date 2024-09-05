import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { StatusRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "SystemSettings" component
 */

interface Props {
  settings: InstanceResponse;
  onReload: () => void;
}

const SystemSettings = ({ settings, onReload }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OnlineOptions>(settings.online_mode);

  const statusOptions = [
    { value: 0, label: t('status.inactive') },
    { value: 1, label: t('status.active') },
    { value: 2, label: t('status.weekend') },
    { value: 3, label: t('status.vacation') },
    { value: 4, label: t('status.holiday') },
  ];

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setStatus(Number(event.target.value) as OnlineOptions);
  };

  const setConfig = async ({ method, status, callback }: StatusRequest) => {
    await databaseRequest(
      {
        model: 'Settings',
        method: method,
        arguments: { status: status },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) callback();
    });
  };

  useEffect(() => {
    setStatus(settings.online_mode);
  }, [settings.online_mode]);

  useEffect(() => {
    setConfig({ method: 'setInstanceOnlineMode', status: status, callback: onReload });
  }, [status]);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="end" p={2} pt={0} gap={2}>
        <Typography variant="h6">{t('texts.instance')}:</Typography>
        <TextField
          select
          label={t('settings.status')}
          value={status}
          onChange={changeStatus}
          variant="filled"
          size="small"
          sx={{ minWidth: 200 }}
        >
          {statusOptions.map((column) => (
            <MenuItem value={column.value} key={column.label}>
              {t(column.label)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Button variant="contained" color="secondary" fullWidth>
        {t('settings.backup')}
      </Button>
      <Button variant="contained" color="info" fullWidth>
        {t('settings.backupRestore')}
      </Button>
    </Stack>
  );
};

export default SystemSettings;
