import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { InstanceStatusOptions } from '@/utils';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
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
  const [pendingStatus, setPendingStatus] = useState<OnlineOptions>(settings?.online_mode || 1);
  const [isLoading, setIsLoading] = useState(false);

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPendingStatus(Number(event.target.value) as OnlineOptions);
  };

  const confirmStatusChange = async () => {
    setIsLoading(true);
    try {
      const response = await setInstanceOnlineMode(pendingStatus);
      if (response.data) {
        setStatus(pendingStatus);
        onReload();
      }
    } catch (error) {
      console.error('Failed to update instance status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelStatusChange = () => {
    setPendingStatus(status);
  };

  useEffect(() => {
    if (settings && settings.online_mode !== status) {
      setStatus(settings.online_mode);
      setPendingStatus(settings.online_mode);
    }
  }, [settings?.online_mode]);

  return (
    <Stack gap={2}>
      <Typography variant="h3">{t('instance.status')}</Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <TextField
          select
          label={t('settings.columns.status')}
          value={pendingStatus}
          onChange={changeStatus}
          variant="filled"
          size="small"
          sx={{ minWidth: 200 }}
          disabled={isLoading}
        >
          {InstanceStatusOptions.map((column) => (
            <MenuItem value={column.value} key={column.label}>
              {t(column.label)}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" gap={1}>
          <Button variant="text" color="error" onClick={cancelStatusChange} disabled={isLoading}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained" onClick={confirmStatusChange} disabled={isLoading}>
            {isLoading ? t('actions.loading') : t('actions.confirm')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SystemSettings;
