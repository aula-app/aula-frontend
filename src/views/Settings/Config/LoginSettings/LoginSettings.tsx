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
  const [oAuth, setOAuth] = useState<0 | 1>();
  const [registration, setRegistration] = useState<0 | 1>();

  const getOnlineStatus = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.success) setOnline(response.data['online_mode']);
    });
  };

  const getConfigs = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getGlobalConfig',
      arguments: {},
    }).then((response) => {
      console.log(response.data);
      if (response.success) {
        setOAuth(response.data['enable_oauth']);
        setRegistration(response.data['allow_registration']);
      }
    });
  };

  type ConfigRequest = { method: string; status: number; callback: () => {} };

  const setConfig = async ({ method, status, callback }: ConfigRequest) => {
    await databaseRequest(
      {
        model: 'Settings',
        method: method,
        arguments: { status: status },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) callback();
    });
  };

  const toggleOnline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(event.target.checked ? 0 : 1);
  };

  const toggleOAuth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOAuth(event.target.checked ? 1 : 0);
  };

  const toggleRegistration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(event.target.checked ? 1 : 0);
  };

  useEffect(() => {
    if (typeof online !== 'undefined')
      setConfig({ method: 'setInstanceOnlineMode', status: online, callback: getOnlineStatus });
  }, [online]);

  useEffect(() => {
    if (typeof oAuth !== 'undefined') setConfig({ method: 'setOauthStatus', status: oAuth, callback: getConfigs });
  }, [oAuth]);

  useEffect(() => {
    if (typeof registration !== 'undefined')
      setConfig({ method: 'setAllowRegistration', status: registration, callback: getConfigs });
  }, [registration]);

  useEffect(() => {
    getOnlineStatus();
    getConfigs();
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
        <FormControlLabel
          control={<Switch checked={Boolean(oAuth)} onChange={toggleOAuth} />}
          label={t(`settings.oauth`)}
        />
      </Grid>
      <Grid size="auto">
        <FormControlLabel
          control={<Switch checked={Boolean(registration)} onChange={toggleRegistration} />}
          label={t(`settings.registration`)}
        />
      </Grid>
    </Grid>
  );
};

export default SystemSettings;
