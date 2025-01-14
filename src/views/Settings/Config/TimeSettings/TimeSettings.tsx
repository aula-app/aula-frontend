import { ConfigResponse } from '@/types/Generics';
import { ConfigRequest } from '@/types/RequestTypes';
import { databaseRequest, FORMAT_DATE_TIME } from '@/utils';
import { Button, FormGroup, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  config?: ConfigResponse;
  onReload: () => void;
}

/** * Renders "SystemSettings" component
 */

const SystemSettings = ({ config, onReload }: Props) => {
  const { t } = useTranslation();

  const [startDay, setStartDay] = useState<number>(config?.first_workday_week || 1);
  const [endDay, setEndDay] = useState<number>(config?.last_workday_week || 5);
  const [startTime, setStartTime] = useState<dayjs.ConfigType>(config?.start_time);
  const [endTime, setEndTime] = useState<dayjs.ConfigType>(config?.daily_end_time);

  var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

  const setConfig = async ({ method, args }: ConfigRequest) => {
    await databaseRequest(
      {
        model: 'Settings',
        method: method,
        arguments: args,
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) onReload();
    });
  };

  const onSubmit = () => {
    setConfig({ method: 'setWorkdays', args: { first_day: startDay, last_day: endDay } });
    setConfig({ method: 'setDailyStartTime', args: { time: startTime } });
    setConfig({ method: 'setDailyEndTime', args: { time: endTime } });
  };

  const onCancel = () => {
    setStartTime(config?.start_time);
    setEndTime(config?.daily_end_time);
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6" py={1}>
        {t(`settings.time.workdays`)}
      </Typography>
      <Grid component={FormGroup} container spacing={1}>
        <Grid size="auto">
          <TextField
            select
            label={t('settings.time.startDay')}
            value={startDay}
            onChange={(data) => setStartDay(Number(data.target.value))}
            variant="outlined"
            sx={{ minWidth: 263 }}
          >
            {week.map((label, value) => (
              <MenuItem value={value} key={value}>
                {t(label)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size="auto">
          <TextField
            select
            label={t('settings.time.endDay')}
            value={endDay}
            onChange={(data) => setEndDay(Number(data.target.value))}
            variant="outlined"
            sx={{ minWidth: 263 }}
          >
            {week.map((label, value) => (
              <MenuItem value={value} key={value}>
                {t(label)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={1}>
          <Grid size="auto">
            <TimePicker
              label={t(`settings.time.startTime`)}
              value={dayjs(startTime)}
              onChange={(date) => {
                if (date) setStartTime(dayjs(date).format(FORMAT_DATE_TIME));
              }}
            />
          </Grid>
          <Grid size="auto">
            <TimePicker
              label={t(`settings.time.endTime`)}
              value={dayjs(endTime)}
              onChange={(date) => {
                if (date) setEndTime(dayjs(date).format(FORMAT_DATE_TIME));
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          {t('actions.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SystemSettings;
