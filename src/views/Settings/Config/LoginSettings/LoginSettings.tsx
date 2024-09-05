import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { ConfigRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  config: ConfigResponse;
  settings: InstanceResponse;
  onReload: () => void | Promise<void>;
}

/** * Renders "SystemSettings" component
 */

const SystemSettings = ({ config, settings, onReload }: Props) => {
  const { t } = useTranslation();

  const [online, setOnline] = useState<boolean>(settings.online_mode === 1);
  const [oAuth, setOAuth] = useState<0 | 1>(config.enable_oauth);
  const [registration, setRegistration] = useState<0 | 1>(config.allow_registration);

  const getOnlineStatus = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.success) onReload();
    });
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

  const toggleOnline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(!event.target.checked);
  };

  const toggleOAuth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOAuth(event.target.checked ? 1 : 0);
  };

  const toggleRegistration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(event.target.checked ? 1 : 0);
  };

  useEffect(() => {
    setConfig({ method: 'setInstanceOnlineMode', args: { status: !!online } });
  }, [online]);

  useEffect(() => {
    setOnline(settings.online_mode === 1);
  }, [settings.online_mode]);

  useEffect(() => {
    setConfig({ method: 'setOauthStatus', args: { status: oAuth } });
  }, [oAuth]);

  useEffect(() => {
    setConfig({ method: 'setAllowRegistration', args: { status: registration } });
  }, [registration]);

  useEffect(() => {
    getOnlineStatus();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid size="auto">
        <FormControlLabel
          control={<Switch checked={!online} onChange={toggleOnline} />}
          label={t(`settings.offline`)}
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
