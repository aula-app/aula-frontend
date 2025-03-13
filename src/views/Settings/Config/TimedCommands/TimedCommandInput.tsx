import { addCommand } from '@/services/config';
import { getGroups } from '@/services/groups';
import { getUsers } from '@/services/users';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { FORMAT_DATE_ONLY, FORMAT_DATE_TIME } from '@/utils';
import { Commands } from '@/utils/commands';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "TimeCommandInput" component
 */

interface Props {
  onReload: () => void;
}

const TimeCommandInput = ({ onReload }: Props) => {
  const { t } = useTranslation();

  const [scope, setScope] = useState<number>(0);
  const [target, setTarget] = useState<string | undefined>();
  const [action, setAction] = useState<number>(0);
  const [value, setValue] = useState<number>(1);
  const [startTime, setStartTime] = useState<dayjs.ConfigType>(dayjs().format(FORMAT_DATE_TIME));
  const [options, setOptions] = useState<{ users: SelectOptionsType; groups: SelectOptionsType }>({
    users: [],
    groups: [],
  });

  async function addField() {
    if (typeof action === 'undefined' || typeof scope === 'undefined' || typeof startTime === 'undefined') return;
    const response = await addCommand({
      cmd_id: Number(`${scope}${Commands[scope].actions[action].value}`),
      command: '',
      target_id: target,
      parameters: value,
      date_start: dayjs(startTime).format(FORMAT_DATE_TIME),
    });
    if (!response.error) onReload();
  }

  const changeScope = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setScope(Number(event.target.value));
    setAction(0);
    setTarget(undefined);
    setValue(1);
  };

  const changeAction = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAction(Number(event.target.value));
    setValue(1);
  };

  const changeTarget = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTarget(event.target.value);
  };

  const changeValue = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const getOptions = () => {
    fetchUsers();
    fetchGroups();
  };

  const fetchUsers = async () => {
    const response = await getUsers();
    if (response.error || !response.data) return;

    const users = response.data.map((user) => ({ label: user.displayname, value: user.hash_id }));
    setOptions((prevOptions) => ({ ...prevOptions, users }));
  };

  const fetchGroups = async () => {
    const response = await getGroups();
    if (response.error || !response.data) return;

    const groups = response.data.map((group) => ({ label: group.group_name, value: group.hash_id }));
    setOptions((prevOptions) => ({ ...prevOptions, groups }));
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h3">
          {t('actions.add', { var: t('settings.columns.command').toLocaleLowerCase() })}:
        </Typography>
        <TextField
          select
          label={t('settings.labels.scope')}
          value={scope}
          onChange={changeScope}
          variant="outlined"
          sx={{ minWidth: 130 }}
          size="small"
          required
        >
          {Commands.map((scopeOptions, i) => (
            <MenuItem value={i} key={i}>
              {scopeOptions.label === 'system' ? t('settings.panels.system') : t(`scopes.${scopeOptions.label}.name`)}
            </MenuItem>
          ))}
        </TextField>
        {(Commands[scope].label === 'users' || Commands[scope].label === 'groups') && (
          <TextField
            select
            label={t(`scopes.${Commands[scope].label}.name`)}
            value={target}
            onChange={changeTarget}
            variant="outlined"
            sx={{ minWidth: 180 }}
            size="small"
            required
          >
            {options[Commands[scope].label].map((statusOptions) => (
              <MenuItem value={statusOptions.value} key={statusOptions.value}>
                {statusOptions.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        {Commands[scope].actions && (
          <TextField
            select
            label={t('settings.columns.command')}
            value={action}
            onChange={changeAction}
            variant="outlined"
            sx={{ minWidth: 180 }}
            size="small"
            required
            disabled={Commands[scope].label !== 'system' && !target}
          >
            {target || Commands[scope].label === 'system' ? (
              Commands[scope].actions.map((commandActions, i) => (
                <MenuItem value={i} key={commandActions.value}>
                  {t(commandActions.label)}
                </MenuItem>
              ))
            ) : (
              <MenuItem></MenuItem>
            )}
          </TextField>
        )}
        {typeof action === 'number' && Commands[scope].actions[action].options && (
          <TextField
            select
            label={t(Commands[scope].actions[action].label)}
            value={value}
            onChange={changeValue}
            variant="outlined"
            sx={{ minWidth: 180 }}
            size="small"
            required
            disabled={typeof action !== 'number'}
          >
            {target || Commands[scope].label === 'system' ? (
              Commands[scope].actions[action].options.map((actionOptions) => (
                <MenuItem value={actionOptions.value} key={actionOptions.value}>
                  {t(actionOptions.label)}
                </MenuItem>
              ))
            ) : (
              <MenuItem></MenuItem>
            )}
          </TextField>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t(`settings.time.startDate`)}
            value={dayjs(startTime)}
            disabled={typeof action !== 'number'}
            format={FORMAT_DATE_ONLY}
            onChange={(date) => {
              if (date) setStartTime(dayjs(date).format(FORMAT_DATE_TIME));
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={addField} sx={{ py: 0.9, alignSelf: 'start' }}>
          {t('actions.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TimeCommandInput;
