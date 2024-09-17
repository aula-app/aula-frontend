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

  const [action, setAction] = useState<number>();
  const [command, setCommand] = useState<number>();
  const [option, setOption] = useState<number>();
  const [options, setOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >();
  const [startTime, setStartTime] = useState<dayjs.ConfigType>(dayjs(new Date()).format(FORMAT_DATE_TIME));

  async function addField() {
    if (typeof action === 'undefined' || typeof command === 'undefined' || typeof option === 'undefined') return;
    await databaseRequest(
      {
        model: 'Command',
        method: 'addCommand',
        arguments: {
          cmd_id: Commands[action].value,
          cmd_name: Commands[action].options[command].label,
          parameters: option,
          date_start: dayjs(startTime).format(FORMAT_DATE_TIME),
        },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) onReload();
    });
  }

  const changeAction = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAction(Number(event.target.value));
  };

  const changeCommand = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setCommand(Number(event.target.value));
  };

  const changeOption = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setOption(Number(event.target.value));
  };

  async function getOptions(scope: SettingNamesType) {
    await databaseRequest({
      model: DataConfig[scope].requests.model,
      method: DataConfig[scope].requests.fetch,
      arguments: {
        limit: 0,
        offset: 0,
      },
    }).then((response) => {
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
    if (typeof action !== 'number' || typeof command !== 'number') return;
    Array.isArray(Commands[action].options[command].options)
      ? setOptions(Commands[action].options[command].options)
      : getOptions(Commands[action].options[command].options as SettingNamesType);
  }, [command]);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h6">{t('generics.add', { var: t('settings.command') })}:</Typography>
        <TextField
          select
          label={t('settings.action')}
          value={action}
          onChange={changeAction}
          variant="outlined"
          sx={{ minWidth: 130 }}
          size="small"
          required
        >
          {Commands.map((actionOptions, i) => (
            <MenuItem value={i} key={actionOptions.label}>
              {t(actionOptions.label)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('settings.command')}
          value={command}
          onChange={changeCommand}
          variant="outlined"
          sx={{ minWidth: 180 }}
          size="small"
          required
          disabled={typeof action !== 'number'}
        >
          {typeof action === 'number' ? (
            Commands[action].options.map((commandOptions, i) => (
              <MenuItem value={i} key={commandOptions.label}>
                {t(commandOptions.label)}
              </MenuItem>
            ))
          ) : (
            <MenuItem></MenuItem>
          )}
        </TextField>
        <TextField
          select
          label={t('settings.content')}
          value={command}
          onChange={changeOption}
          variant="outlined"
          sx={{ minWidth: 180 }}
          size="small"
          required
          disabled={!options}
        >
          {options ? (
            options.map((statusOptions) => (
              <MenuItem value={statusOptions.value} key={statusOptions.label}>
                {t(statusOptions.label)}
              </MenuItem>
            ))
          ) : (
            <MenuItem></MenuItem>
          )}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t(`settings.dateStart`)}
            value={dayjs(startTime)}
            disabled={typeof option !== 'number'}
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
