import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, FORMAT_DATE_ONLY, FORMAT_DATE_TIME } from '@/utils';
import { Commands } from '@/utils/commands';
import DataConfig from '@/utils/Data';
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
  const [target, setTarget] = useState<number>();
  const [action, setAction] = useState<number>(0);
  const [value, setValue] = useState<number>(1);
  const [startTime, setStartTime] = useState<dayjs.ConfigType>(dayjs(new Date()).format(FORMAT_DATE_TIME));
  const [options, setOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >();

  async function addField() {
    if (typeof action === 'undefined' || typeof scope === 'undefined' || typeof startTime === 'undefined') return;
    await databaseRequest(
      {
        model: 'Command',
        method: 'addCommand',
        arguments: {
          cmd_id: Number(`${scope}${Commands[scope].actions[action].value}`),
          command: '',
          target_id: target,
          parameters: value,
          date_start: dayjs(startTime).format(FORMAT_DATE_TIME),
        },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) onReload();
    });
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
    setTarget(Number(event.target.value));
  };

  const changeValue = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  async function getOptions(scope: SettingNamesType) {
    const requestId = [];
    if (scope === 'ideas' || scope === 'boxes') requestId.push('user_id');

    await databaseRequest(
      {
        model: DataConfig[scope].requests.model,
        method: DataConfig[scope].requests.fetch,
        arguments: {
          limit: 0,
          offset: 0,
        },
      },
      requestId
    ).then((response) => {
      if (response.success)
        setOptions(
          // @ts-ignore
          response.data.map((row) => {
            return { label: row[DataConfig[scope].columns[0].name], value: row.id };
          })
        );
    });
  }

  useEffect(() => {
    if (scope && Commands[scope].label !== 'system') getOptions(Commands[scope].label);
  }, [scope]);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h6">{t('generics.add', { var: t('settings.command') })}:</Typography>
        <TextField
          select
          label={t('settings.scope')}
          value={scope}
          onChange={changeScope}
          variant="outlined"
          sx={{ minWidth: 130 }}
          size="small"
          required
        >
          {Commands.map((scopeOptions, i) => (
            <MenuItem value={i} key={i}>
              {t(
                `views.${scopeOptions.label === 'system' ? scopeOptions.label : DataConfig[scopeOptions.label].requests.item.toLowerCase()}`
              )}
            </MenuItem>
          ))}
        </TextField>
        {Commands[scope].label !== 'system' && (
          <TextField
            select
            label={t(`views.${DataConfig[Commands[scope].label].requests.item.toLowerCase()}`)}
            value={target}
            onChange={changeTarget}
            variant="outlined"
            sx={{ minWidth: 180 }}
            size="small"
            required
            disabled={!options}
          >
            {options ? (
              options.map((statusOptions) => (
                <MenuItem value={statusOptions.value} key={statusOptions.value}>
                  {statusOptions.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem></MenuItem>
            )}
          </TextField>
        )}
        {Commands[scope].actions && (
          <TextField
            select
            label={t('settings.command')}
            value={action}
            onChange={changeAction}
            variant="outlined"
            sx={{ minWidth: 180 }}
            size="small"
            required
            disabled={Commands[scope].label !== 'system' && typeof target !== 'number'}
          >
            {typeof target === 'number' || Commands[scope].label === 'system' ? (
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
            {typeof target === 'number' || Commands[scope].label === 'system' ? (
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
            label={t(`settings.dateStart`)}
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
          {t('generics.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TimeCommandInput;
