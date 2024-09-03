import { Button, Checkbox, FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SysytemSettings = () => {
  const { t } = useTranslation();

  const [weekDays, setWeekDays] = useState<number[]>([]);

  var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

  const toggleDay = (day: number) => {
    weekDays.includes(day) ? setWeekDays([...weekDays.filter((i) => i !== day)]) : setWeekDays([...weekDays, day]);
  };

  return (
    <Stack>
      <Typography variant="h6" py={1}>
        {t(`settings.time`)}
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
            <TimePicker label={t(`settings.timeStart`)} defaultValue={dayjs('2022-04-17T08:00')} />
          </Grid>
          <Grid size="auto" pt={1}>
            <TimePicker label={t(`settings.timeEnd`)} defaultValue={dayjs('2022-04-17T118:00')} />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Typography variant="h6" pt={5}>
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
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }}>
          {t('generics.cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {t('generics.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SysytemSettings;
