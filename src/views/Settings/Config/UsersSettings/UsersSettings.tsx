import { AppIcon } from '@/components';
import RoomField from '@/components/DataFields/RoomField';
import { addAllCSV } from '@/services/config';
import { useAppStore } from '@/store';
import { RoleTypes, UpdateType } from '@/types/SettingsTypes';
import { LanguageTypes } from '@/types/Translation';
import { roles } from '@/utils';
import { DATE_FORMATS, DEFAULT_FORMAT_DATE_TIME } from '@/utils/units';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
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

interface CSVErrorDetail {
  collision_keys: Record<string, string> | string[];
  line_number: number;
}

interface CSVErrorResponse {
  success: false;
  error_code: number;
  error: string;
  errors: CSVErrorDetail[];
}

interface LineError {
  lineNumber: number;
  message: string;
  collisionKeys: string[];
}

/** Renders "DataSettings" component */

const DataSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [users, setUsers] = useState<Array<string>>([]);
  const [role, setRole] = useState<RoleTypes | 0>(20);
  const [rooms, setRooms] = useState<UpdateType>({ add: [], remove: [] });
  const [inviteDate, setInviteDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lineErrors, setLineErrors] = useState<Map<number, LineError>>(new Map());

  // Create role options (excluding admin roles for CSV upload)
  const roleOptions = roles
    .filter((role) => role < 40) // Exclude admin roles
    .map((r) => ({ value: r, label: t(`roles.${r}`) }));

  const handleRoleChange = (event: SelectChangeEvent<unknown>) => {
    setRole(Number(event.target.value) as RoleTypes);
  };

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
    setLineErrors(new Map());
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
    setLineErrors(new Map());
    const send_emails_at =
      inviteDate === null || inviteDate <= dayjs()
        ? undefined
        : dayjs(inviteDate).utc().format(DEFAULT_FORMAT_DATE_TIME);
    const response = await addAllCSV(csv, rooms.add, role as RoleTypes, send_emails_at);
    setLoading(false);
    if (!response.data) {
      // Check if we have detailed CSV error information
      if (response.detail && typeof response.detail === 'object') {
        const detail = response.detail as CSVErrorResponse;
        if (detail.errors && Array.isArray(detail.errors)) {
          // Parse the detailed errors and map them to line numbers
          const errorMap = new Map<number, LineError>();
          detail.errors.forEach((error: CSVErrorDetail) => {
            // Handle collision_keys as either an object or array
            const collisionKeys = Array.isArray(error.collision_keys)
              ? error.collision_keys
              : Object.values(error.collision_keys);

            const collisionMessage = collisionKeys.map((key) => t(`settings.columns.${key}`) || key).join(', ');
            errorMap.set(error.line_number, {
              lineNumber: error.line_number,
              message: `${detail.error} (${collisionMessage})`,
              collisionKeys: collisionKeys,
            });
          });
          setLineErrors(errorMap);
          setError(t('forms.csv.lineErrors', { count: detail.errors.length }));
          return;
        }
      }
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
            <TableCell></TableCell>
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
            const lineError = lineErrors.get(userIndex);
            const hasError = !!lineError;
            return (
              <>
                {hasError && (
                  <TableRow key={`error-${userIndex}`}>
                    <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                      <Alert severity="error" sx={{ py: 0 }}>
                        <Typography variant="body2">
                          <strong>
                            {t('forms.csv.line')} {userIndex + 1}:
                          </strong>{' '}
                          {lineError.message}
                        </Typography>
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow
                  key={`user-${userIndex}`}
                  sx={{
                    backgroundColor: hasError ? 'error.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: hasError ? 'error.light' : 'action.hover',
                    },
                  }}
                >
                  <TableCell
                    key={`cell-index-${userIndex}`}
                    sx={{
                      color: hasError ? 'error.contrastText' : 'inherit',
                    }}
                  >
                    {userIndex + 1}
                  </TableCell>
                  {keys.map((key, keyIndex) => (
                    <TableCell
                      key={`cell-${userIndex}-${keyIndex}`}
                      sx={{
                        color: hasError ? 'error.contrastText' : 'inherit',
                      }}
                    >
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>

      <Stack gap={2}>
        <Stack direction="row" alignItems="center" gap={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="role-select-label">{t('settings.columns.userlevel')}</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label={t('settings.columns.userlevel')}
              onChange={handleRoleChange}
              disabled={loading}
              data-testid="select-field-role"
              MenuProps={{
                PaperProps: {
                  'data-testid': 'select-field-role-list',
                },
              }}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} data-testid={`select-option-${option.value}`}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <RoomField selected={rooms} onChange={(updates) => setRooms(updates)} disabled={loading} />
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
