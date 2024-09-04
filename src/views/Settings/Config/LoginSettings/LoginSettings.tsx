import { ConfigResponse } from '@/types/Generics';
import { StatusRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid2';
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

  const [online, setOnline] = useState<0 | 1>();
  const [oAuth, setOAuth] = useState<0 | 1>(config['enable_oauth']);
  const [registration, setRegistration] = useState<0 | 1>(config['allow_registration']);

  const getOnlineStatus = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.success) setOnline(response.data['online_mode']);
    });
  };

  const setConfig = async ({ method, status, callback }: StatusRequest) => {
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
    if (typeof oAuth !== 'undefined') setConfig({ method: 'setOauthStatus', status: oAuth, callback: onReload });
  }, [oAuth]);

  useEffect(() => {
    if (typeof registration !== 'undefined')
      setConfig({ method: 'setAllowRegistration', status: registration, callback: onReload });
  }, [registration]);

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
