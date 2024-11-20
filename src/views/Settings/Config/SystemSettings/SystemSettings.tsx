import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { StatusRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { InstanceStatusOptions } from '@/utils/commands';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const getBackup = async () => {
    await databaseRequest({
      model: 'Converters',
      method: 'createDBDump',
      arguments: {},
    }).then((response) => {
      if (!response.success || !response.data) return;
      triggerSqlDumpDownload(response.data);
    });
  };

  const triggerSqlDumpDownload = (sqlDumpLines: string[]) => {
    // Convert array of lines to single string
    const sqlDumpContent = sqlDumpLines.join('\n');

    // Create a Blob from the SQL dump content
    const blob = new Blob([sqlDumpContent], { type: 'text/sql' });

    // Generate a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    const filename = `aula_bakcup_${timestamp}.sql.bkp`;

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Trigger download immediately
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    setStatus(settings?.online_mode || 1);
  }, [settings?.online_mode]);

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
          {InstanceStatusOptions.map((column) => (
            <MenuItem value={column.value} key={column.label}>
              {t(column.label)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Button variant="contained" color="secondary" onClick={getBackup} fullWidth>
        {t('settings.backup')}
      </Button>
      <Button variant="contained" color="info" fullWidth>
        {t('settings.backupRestore')}
      </Button>
    </Stack>
  );
};

export default SystemSettings;
