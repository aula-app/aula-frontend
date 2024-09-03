import { Checkbox, FormControlLabel, FormGroup, Grid2 as Grid, Switch, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [weekDays, setWeekDays] = useState<number[]>([]);

  var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

  const toggleDay = (day: number) => {
    weekDays.includes(day) ? setWeekDays([...weekDays.filter((i) => i !== day)]) : setWeekDays([...weekDays, day]);
  };

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} gap={2} p={2}>
      <Typography variant="h4" pb={2}>
        {t('views.configuration')}
      </Typography>
      <Stack gap={1}>
        <Typography variant="h5" py={1}>
          {t(`settings.school`)}
        </Typography>
        <TextField label={t(`settings.name`)} fullWidth />
        <TextField label={t(`settings.description`)} minRows={4} multiline type="text" fullWidth />
      </Stack>
      <Stack>
        <Typography variant="h5" py={1}>
          {t(`settings.settings`)}
        </Typography>
        <Typography variant="h6">{t('settings.categories')}</Typography>
        <Categories />
      </Stack>
      <Stack>
        <Typography variant="h5" py={1}>
          {t(`settings.time`)}
        </Typography>
        <Typography variant="h6">{t(`settings.workDays`)}</Typography>
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
        <Typography variant="h6">{t(`settings.workHours`)}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={1}>
            <Grid size="auto" pt={1}>
              <TimePicker label={t(`settings.timeStart`)} defaultValue={dayjs('2022-04-17T08:00')} />
            </Grid>
            <Grid size="auto" pt={1}>
              <TimePicker label={t(`settings.timeEnd`)} defaultValue={dayjs('2022-04-17T118:00')} />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Stack>
      <Typography variant="h5" pt={1}>
        {t(`settings.login`)}
      </Typography>
      <Grid container spacing={1}>
        <Grid size="auto">
          <FormControlLabel control={<Switch />} label={t(`settings.vacation`)} />
        </Grid>
        <Grid size="auto">
          <FormControlLabel control={<Switch />} label={t(`settings.oAuth`)} />
        </Grid>
        <Grid size="auto">
          <FormControlLabel control={<Switch />} label={t(`settings.registration`)} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ConfigView;
