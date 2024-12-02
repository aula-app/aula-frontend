import { AppIcon } from '@/components';
import SelectRoom from '@/components/SelectRoom';
import { useAppStore } from '@/store';
import { databaseRequest } from '@/utils';
import { Button, FormHelperText, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onReload: () => void;
}

/** * Renders "SystemSettings" component
 */

const DataSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [users, setUsers] = useState<Array<string>>([]);
  const [room, setRoom] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;

    Array.from(e.target.files).forEach((file) => readCSV(file));
  };

  const onSubmit = () => {
    if (room === '') {
      setError(t('texts.CSVnoRoom'));
      return;
    }
    if (users.length === 0) {
      setError(t('texts.CSVempty'));
      return;
    }
    uploadCSV(users.join('/n'));
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (!reader.result) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
        return;
      }
      const lines = String(reader.result).split('\n');
      console.log(lines.length);
      if (lines.length < 2) {
        setError(t('texts.CSVempty'));
        return;
      }
      if (lines[0].replace('\r', '') !== 'realname;displayname;username;email;about_me') {
        setError(t('texts.CSVinvalid'));
        return;
      }
      lines.splice(0, 1);
      setUsers(lines);
    };
    reader.readAsText(file);
  };

  const selectRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRoom(Number(event.target.value));
  };

  const uploadCSV = async (csv: string) => {
    await databaseRequest({
      model: 'User',
      method: 'addCSV',
      arguments: {
        csv: csv,
        room_id: room,
      },
    }).then((response) => {
      if (!response.success) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
        return;
      }
      dispatch({ type: 'ADD_POPUP', message: { message: t('texts.CSVsuccess'), type: 'success' } });
      setUsers([]);
      setRoom('');
      onReload();
    });
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" gap={3} flexWrap="wrap">
        {t('texts.fileDownload')}:{' '}
        <a href="/data/aula_users.csv" download target="_blank" rel="noreferrer">
          <Button color="secondary" variant="outlined">
            <AppIcon icon="download" size="small" sx={{ mr: 1, ml: -0.5 }} />
            aula_users.csv
          </Button>
        </a>
      </Stack>
      <Stack>
        <Stack direction="row" alignItems="center" gap={3}>
          <Button variant="contained" component="label" color="secondary">
            {t('texts.fileUpload')}
            <input type="file" name="my_files" multiple hidden onChange={handleFileChange} />
          </Button>
          {t('texts.select', { var: t('views.room') })}:
          <SelectRoom room={room} setRoom={selectRoom} />
        </Stack>
        <FormHelperText error={error !== ''}>{error}</FormHelperText>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('settings.realname')}</TableCell>
            <TableCell>{t('settings.displayname')}</TableCell>
            <TableCell>{t('settings.username')}</TableCell>
            <TableCell>{t('settings.email')}</TableCell>
            <TableCell>{t('settings.about_me')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const keys = user.split(';');
            return (
              <TableRow>
                {keys.map((key) => (
                  <TableCell>{key}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button variant="contained" component="label" onClick={onSubmit}>
        {t('generics.confirm')}
      </Button>
    </Stack>
  );
};

export default DataSettings;
