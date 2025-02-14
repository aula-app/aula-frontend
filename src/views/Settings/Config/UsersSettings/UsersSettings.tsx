import { AppIcon } from '@/components';
import SelectRole from '@/components/SelectRole';
import SelectRoom from '@/components/SelectRoom';
import { useAppStore } from '@/store';
import { RoleTypes } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import {
  Button,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
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
  const [role, setRole] = useState<RoleTypes | 0 | undefined>(10);
  const [room, setRoom] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onReset();
    if (!e.target.files || e.target.files.length < 1) return;

    Array.from(e.target.files).forEach((file) => readCSV(file));
  };

  const onSubmit = () => {
    if (room === '') {
      setError(t('forms.csv.noRoom'));
      return;
    }
    if (users.length === 0) {
      setError(t('forms.csv.empty'));
      return;
    }
    uploadCSV(users.join('/n'));
  };

  const onReset = () => {
    setUsers([]);
    setRoom('');
    setError('');
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (!reader.result) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        return;
      }
      const lines = String(reader.result).split('\n');
      if (lines.length < 2) {
        setError(t('forms.csv.empty'));
        return;
      }
      lines.map((line, i) => {
        const items = line.split(';');
        if (
          !items[0] ||
          !items[1] ||
          !items[2] ||
          (i === 0 && line !== 'realname;displayname;username;email;about_me')
        ) {
          setError(t('forms.csv.invalid'));
          return;
        }
      });
      lines.splice(0, 1);
      setUsers(lines);
    };
    reader.readAsText(file);
  };

  const uploadCSV = async (csv: string) => {
    await databaseRequest({
      model: 'User',
      method: 'addCSV',
      arguments: {
        csv: csv,
        room_id: room,
        user_level: role,
      },
    }).then((response) => {
      if (!response.data) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        return;
      }
      dispatch({ type: 'ADD_POPUP', message: { message: t('forms.csv.success'), type: 'success' } });
      onReload();
      onReset();
    });
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" gap={3} flexWrap="wrap">
        <Typography flex={1}>{t('forms.csv.template')}</Typography>
        <Stack flex={1} gap={2}>
          <Button variant="contained" component="label" fullWidth>
            {t('ui.files.upload')}
            <input type="file" name="my_files" multiple hidden onChange={handleFileChange} />
          </Button>
          <Stack direction="row" alignItems="center" gap={2}>
            <Button variant="contained" component="label" color="error" fullWidth onClick={onReset}>
              {t('actions.cancel')}
            </Button>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              href="/data/aula_users.csv"
              download
              target="_blank"
              rel="noreferrer"
            >
              <AppIcon icon="download" size="small" sx={{ mr: 1, ml: -0.5 }} />
              {t('ui.files.download')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('settings.columns.realname')}*</TableCell>
            <TableCell>{t('settings.columns.displayname')}*</TableCell>
            <TableCell>{t('settings.columns.username')}*</TableCell>
            <TableCell>{t('settings.columns.email')}</TableCell>
            <TableCell>{t('settings.columns.about_me')}</TableCell>
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
      <Stack>
        <Stack direction="row" alignItems="center" gap={3}>
          {t('actions.select', { var: t('scopes.room.name') })}:
          <SelectRoom room={room || ''} setRoom={setRoom} />
          {t('actions.select', { var: t('settings.columns.userlevel') })}:
          <SelectRole userRole={role} setRole={setRole} variant="filled" />
        </Stack>
        <FormHelperText error={error !== ''}>{`${error || ''}`}</FormHelperText>
      </Stack>
      <Button variant="contained" component="label" onClick={onSubmit}>
        {t('actions.confirm')}
      </Button>
    </Stack>
  );
};

export default DataSettings;
