import { databaseRequest } from '@/utils';
import { FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "SystemSettings" component
 */

const SystemSettings = () => {
  const { t } = useTranslation();

  const [online, setOnline] = useState<0 | 1>();

  const getOnlineStatus = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      console.log(response.data);
      if (response.success) setOnline(response.data['online_mode']);
    });
  };

  const setOnlineStatus = async () => {
    await databaseRequest(
      {
        model: 'Settings',
        method: 'setInstanceOnlineMode',
        arguments: { status: online },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) getOnlineStatus();
    });
  };

  const toggleOnline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(event.target.checked ? 0 : 1);
  };

  useEffect(() => {
    if (typeof online !== 'undefined') setOnlineStatus();
  }, [online]);

  useEffect(() => {
    getOnlineStatus();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid size="auto">
        <FormControlLabel
          control={<Switch checked={!Boolean(online)} onChange={toggleOnline} />}
          label={t(`settings.vacation`)}
        />
      </Grid>
      <Grid size="auto">
        <FormControlLabel control={<Switch />} label={t(`settings.oauth`)} />
      </Grid>
      <Grid size="auto">
        <FormControlLabel control={<Switch />} label={t(`settings.registration`)} />
      </Grid>
    </Grid>
  );
};

export default SystemSettings;
