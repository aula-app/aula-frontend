import { AppIconButton } from '@/components';
import MarkdownLoader from '@/components/MarkdownLoader';
import i18n from '@/i18n';
import { InstanceResponse, OnlineOptions } from '@/types/Generics';
import { StatusRequest } from '@/types/RequestTypes';
import { databaseRequest, InstanceStatusOptions } from '@/utils';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  MenuItem,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { TransitionProps } from 'notistack';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Import markdown files for different languages
import markdownDE from './RestoreBackup/restore_backup.de.md';
import markdownEN from './RestoreBackup/restore_backup.en.md';

// Mapping of language codes to markdown files
const languageMarkdownMap = {
  en: markdownEN,
  de: markdownDE,
};

// Dialog trasition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/** * Renders "SystemSettings" component
 */

interface Props {
  settings?: InstanceResponse;
  onReload: () => void;
}

const SystemSettings = ({ settings, onReload }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OnlineOptions>(settings?.online_mode || 1);
  const [restoreDialog, setRestoreDialog] = useState<boolean>(false);

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
      if (response.data) callback();
    });
  };

  const getBackup = async () => {
    await databaseRequest({
      model: 'Converters',
      method: 'createDBDump',
      arguments: {},
    }).then((response) => {
      if (!response.data || !response.data) return;
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
    const filename = `aula_backup_${timestamp}.sql.bkp`;

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
    if (settings && settings.online_mode !== status) setStatus(settings.online_mode);
  }, [settings?.online_mode]);

  useEffect(() => {
    setConfig({ method: 'setInstanceOnlineMode', status: status, callback: onReload });
  }, [status]);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="end" p={2} pt={0} gap={2}>
        <Typography variant="h6">{t('instance.status')}:</Typography>
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
      <Button variant="contained" color="secondary" onClick={getBackup} fullWidth>
        {t('settings.backup.create')}
      </Button>
      <Button variant="contained" color="info" onClick={() => setRestoreDialog(true)} fullWidth>
        {t('settings.backup.restore')}
      </Button>
      <Dialog
        fullScreen
        open={restoreDialog}
        onClose={() => setRestoreDialog(false)}
        TransitionComponent={Transition}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar sx={{ position: 'relative' }} color="secondary">
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t('settings.backup.headline')}
            </Typography>
            <AppIconButton icon="close" autoFocus onClick={() => setRestoreDialog(false)} />
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <MarkdownLoader src={languageMarkdownMap[i18n.language as 'en' | 'de']} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default SystemSettings;
