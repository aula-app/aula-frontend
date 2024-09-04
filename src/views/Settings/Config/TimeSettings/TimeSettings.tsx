import { ConfigResponse } from '@/types/Generics';
import { ConfigRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  config: ConfigResponse;
  onReload: () => void;
}

/** * Renders "SystemSettings" component
 */

const SystemSettings = ({ config, onReload }: Props) => {
  const { t } = useTranslation();

  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date>(config.start_time);
  const [endTime, setEndTime] = useState<Date>(config.daily_end_time);

  var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

  const toggleDay = (day: number) => {
    weekDays.includes(day) ? setWeekDays([...weekDays.filter((i) => i !== day)]) : setWeekDays([...weekDays, day]);
  };

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
    setConfig({ method: 'setDailyStartTime', args: { time: startTime } });
    setConfig({ method: 'setDailyEndTime', args: { time: endTime } });
  };

  const onCancel = () => {
    setStartTime(config.start_time);
    setEndTime(config.daily_end_time);
  };

  return (
    <Stack>
      <Typography variant="h6" py={1}>
        {t(`settings.workDays`)}
      </Typography>
      <Grid component={FormGroup} container>
        {week.map((day, i) => (
          <Grid size="auto" key={i}>
            <FormControlLabel
              control={<Checkbox checked={weekDays.includes(i)} onChange={() => toggleDay(i)} />}
              label={t(`week.${day}`)}
            />
          </Grid>
        ))}
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={1}>
          <Grid size="auto" pt={1}>
            <TimePicker
              label={t(`settings.timeStart`)}
              value={dayjs(startTime)}
              onChange={(date) => {
                if (date) setStartTime(dayjs(date).toDate());
              }}
            />
          </Grid>
          <Grid size="auto" pt={1}>
            <TimePicker
              label={t(`settings.timeEnd`)}
              value={dayjs(endTime)}
              onChange={(date) => {
                if (date) setEndTime(dayjs(date).toDate());
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onCancel}>
          {t('generics.cancel')}
        </Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          {t('generics.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SystemSettings;
