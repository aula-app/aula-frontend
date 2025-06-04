import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { InstanceStatusOptions } from '@/utils';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Import markdown files for different languages
import { setInstanceOnlineMode } from '@/services/config';

/** * Renders "SystemSettings" component
 */

interface Props {
  settings?: InstanceResponse;
  onReload: () => void;
}

const SystemSettings = ({ settings, onReload }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OnlineOptions>(settings?.online_mode || 1);

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setStatus(Number(event.target.value) as OnlineOptions);
  };

  const setOnlineMode = async () => {
    const response = await setInstanceOnlineMode(status);
    if (response.data) onReload();
  };

  useEffect(() => {
    if (settings && settings.online_mode !== status) setStatus(settings.online_mode);
  }, [settings?.online_mode]);

  useEffect(() => {
    const updateOnlineMode = async () => {
      await setOnlineMode();
    };
    updateOnlineMode();
  }, [status]);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="end" p={2} pt={0} gap={2}>
        <Typography variant="h3">{t('instance.status')}:</Typography>
        <TextField
          select
          label={t('settings.columns.status')}
          value={status}
          onChange={changeStatus}
          variant="filled"
          size="small"
          sx={{ minWidth: 200 }}
        >
          {InstanceStatusOptions.map((column) => (
            <MenuItem value={column.value} key={column.label}>
              {t(column.label)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
};

export default SystemSettings;
