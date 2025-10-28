import { AppIcon } from '@/components';
import RoomField from '@/components/DataFields/RoomField';
import SelectRole from '@/components/SelectRole';
import { addAllCSV } from '@/services/config';
import { useAppStore } from '@/store';
import { RoleTypes, UpdateType } from '@/types/SettingsTypes';
import { LanguageTypes } from '@/types/Translation';
import { DATE_FORMATS, DEFAULT_FORMAT_DATE_TIME } from '@/utils/units';
import {
  Button,
  FormHelperText,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import i18next from 'i18next';
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
  const [role, setRole] = useState<RoleTypes | 0>(20);
  const [rooms, setRooms] = useState<UpdateType>({ add: [], remove: [] });
  const [inviteDate, setInviteDate] = useState<dayjs.Dayjs | null>(dayjs());
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
    const send_emails_at =
      inviteDate === null || inviteDate <= dayjs()
        ? undefined
        : dayjs(inviteDate).utc().format(DEFAULT_FORMAT_DATE_TIME);
    const response = await addAllCSV(csv, rooms.add, role as RoleTypes, send_emails_at);
    setLoading(false);
    if (!response.data) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      return;
    }
    dispatch({ type: 'ADD_POPUP', message: { message: t('forms.csv.success'), type: 'success' } });
    onReload();
    onReset();
  };

  return (
    <Stack gap={2}>
      {loading && <LinearProgress color="secondary" />}
      <Stack direction="row" alignItems="center" gap={3} flexWrap="wrap">
        <Typography flex={1}>{t('forms.csv.template')}</Typography>
        <Stack flex={1} gap={2}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            disabled={loading}
            data-testid="upload-users-csv-button"
            aria-label={t('ui.files.upload')}
          >
            {t('ui.files.upload')}
            <input type="file" name="my_files" multiple hidden onChange={handleFileChange} />
          </Button>
          <Stack direction="row" alignItems="center" gap={2}>
            <Button variant="contained" component="label" color="error" fullWidth onClick={onReset} disabled={loading}>
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
              disabled={loading}
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

      <Stack gap={2}>
        <Stack direction="row" alignItems="center" gap={3}>
          <SelectRole
            defaultValue={20}
            noAdmin
            disabled={loading}
            onChange={newRole => setRole(newRole)}
            variant="filled"
            name="role"
          />
          <RoomField
            selected={rooms}
            onChange={(updates) => setRooms(updates)}
            disabled={loading}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label={t('settings.time.inviteDate')}
              value={inviteDate}
              onChange={setInviteDate}
              format={DATE_FORMATS[i18next.language as LanguageTypes].dateTime}
              sx={{ minWidth: 200 }}
              data-testid="user-invite-date-picker"
            />
          </LocalizationProvider>
        </Stack>
        {error !== '' && <FormHelperText error={error !== ''}>{`${error || ''}`}</FormHelperText>}
      </Stack>
      <Button data-testid="confirm_upload" variant="contained" component="label" onClick={onSubmit} disabled={loading}>
        {loading ? t('status.waiting') : t('actions.confirm')}
      </Button>
    </Stack>
  );
};

export default DataSettings;
