import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { InstanceStatusOptions } from '@/utils';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Import markdown files for different languages
import { setInstanceOnlineMode } from '@/services/config';
import { useAppStore } from '@/store';

/** * Renders "SystemSettings" component
 */

interface Props {
  settings?: InstanceResponse;
  onReload: () => void;
}

const SystemSettings = ({ settings, onReload }: Props) => {
  const { t } = useTranslation();
const [status, setStatus] = useState<OnlineOptions>(settings?.online_mode ?? 1);
  const [pendingStatus, setPendingStatus] = useState<OnlineOptions>(settings?.online_mode ?? 1);
  const [isLoading, setIsLoading] = useState(false);
  const [, dispatch] = useAppStore();

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
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
      cancelStatusChange();
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <TextField
          select
          label={t('instance.status')}
          value={pendingStatus}
          onChange={changeStatus}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
          disabled={isLoading}
        >
          {InstanceStatusOptions.map((column) => (
            <MenuItem value={column.value} key={column.label} data-testid={`status-option-${column.label}`}>
              {t(column.label)}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" gap={1}>
          {pendingStatus !== status && (
            <Button
              variant="text"
              color="error"
              onClick={cancelStatusChange}
              disabled={isLoading}
              aria-label={t('actions.revert')}
              data-testid="system-settings-cancel-button"
            >
              {t('actions.revert')}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={confirmStatusChange}
            disabled={isLoading || pendingStatus === status}
            aria-label={t('actions.confirm')}
            data-testid="system-settings-confirm-button"
          >
            {isLoading ? t('actions.loading') : t('actions.confirm')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SystemSettings;
