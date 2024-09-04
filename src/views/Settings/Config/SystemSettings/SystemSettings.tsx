import { STATUS } from '@/components/Data/EditData/DataConfig/formDefaults';
import { ConfigResponse, StatusTypes } from '@/types/Generics';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "SystemSettings" component
 */

interface Props {
  config: ConfigResponse;
  onReload: () => void;
}

const SystemSettings = ({ config, onReload }: Props) => {
  const { t } = useTranslation();
  const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];
  const [status, setStatus] = useState<StatusTypes>(1);

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!setStatus) return;
    setStatus(Number(event.target.value) as StatusTypes);
  };
  return (
    <Stack gap={2}>
      {status && (
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
      )}
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
