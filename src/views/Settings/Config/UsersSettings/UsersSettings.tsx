import { AppIcon } from '@/components';
import RoomField from '@/components/DataFields/RoomField';
import SelectRole from '@/components/SelectRole';
import { addCSV } from '@/services/config';
import { useAppStore } from '@/store';
import { RoleTypes, UpdateType } from '@/types/SettingsTypes';
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
  const [role, setRole] = useState<RoleTypes>(20);
  const [rooms, setRooms] = useState<UpdateType>({ add: [], remove: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onReset();
    if (!e.target.files || e.target.files.length < 1) return;

    Array.from(e.target.files).forEach((file) => readCSV(file));
  };

  const onSubmit = () => {
    if (rooms.add.length === 0) {
      setError(t('forms.csv.noRoom'));
      return;
    }
    if (users.length === 0) {
      setError(t('forms.csv.empty'));
      return;
    }
    uploadCSV(users.join('\n'));
  };

  const onReset = () => {
    setUsers([]);
    setRooms({ add: [], remove: [] });
    setError('');
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (!reader.result) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        return;
      }
      const lines = String(reader.result)
        .normalize('NFC') // Normalize text to handle diacritical marks
        .split('\n')
        .filter((l) => l.trim() !== ''); // Ensure no empty lines
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
          (i === 0 && !line.includes('realname;displayname;username;email;about_me'))
        ) {
          setError(t('forms.csv.invalid'));
          return;
        }
      });
      lines.splice(0, 1); // Remove the header row
      setUsers(lines);
    };
    reader.readAsText(file);
  };

  const uploadCSV = async (csv: string) => {
    setLoading(true);
    const responses = await Promise.all(rooms.add.map((room) => addCSV(csv, room, role)));
    setLoading(false);
    responses.forEach((response) => {
      if (!response.data) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
        return;
      }
    });
    dispatch({ type: 'ADD_POPUP', message: { message: t('forms.csv.success'), type: 'success' } });
    onReload();
    onReset();
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
              <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {t('ui.files.download')}
              </Typography>
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
          {users.map((user, userIndex) => {
            const keys = user.split(';');
            return (
              <TableRow key={`user-${userIndex}`}>
                {keys.map((key, keyIndex) => (
                  <TableCell key={`cell-${userIndex}-${keyIndex}`}>{key}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Stack>
        <Stack direction="row" alignItems="center" gap={3}>
          <SelectRole userRole={role} onChange={(role) => setRole(role as RoleTypes)} variant="filled" noAdmin />
          <RoomField data-testing-id="user-room-select" selected={rooms} onChange={(updates) => setRooms(updates)} />
        </Stack>
        <FormHelperText error={error !== ''}>{`${error || ''}`}</FormHelperText>
      </Stack>
      <Button
        data-testing-id="confirm_upload"
        variant="contained"
        component="label"
        onClick={onSubmit}
        disabled={loading}
      >
        {t('actions.confirm')}
      </Button>
    </Stack>
  );
};

export default DataSettings;
