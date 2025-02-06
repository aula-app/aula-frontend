import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { ConfigRequest } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  config?: ConfigResponse;
  settings?: InstanceResponse;
  onReload: () => void | Promise<void>;
}

/** * Renders "SystemSettings" component
 */

const SystemSettings = ({ config, settings, onReload }: Props) => {
  const { t } = useTranslation();

  const isInitialMount = useRef(true);
  const [online, setOnline] = useState<boolean>(
    settings?.online_mode !== undefined ? Boolean(settings?.online_mode) : true
  );
  const [oAuth, setOAuth] = useState<0 | 1>(config?.enable_oauth ?? 0);
  const [registration, setRegistration] = useState<0 | 1>(config?.allow_registration ?? 1);

  const getOnlineStatus = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.data) onReload();
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
      if (response.data) onReload();
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

  // Reset isInitialMount on unmount
  useEffect(() => {
    return () => {
      isInitialMount.current = true;
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setConfig({ method: 'setInstanceOnlineMode', args: { status: !!online } });
  }, [online]);

  useEffect(() => {
    if (settings?.online_mode !== undefined) {
      setOnline(Boolean(settings.online_mode));
    }
  }, [settings?.online_mode]);

  useEffect(() => {
    if (isInitialMount.current) return;
    setConfig({ method: 'setOauthStatus', args: { status: oAuth } });
  }, [oAuth]);

  useEffect(() => {
    if (isInitialMount.current) return;
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
          label={t(`settings.advanced.offline`)}
        />
      </Grid>
      <Grid size="auto">
        <FormControlLabel
          control={<Switch checked={Boolean(oAuth)} onChange={toggleOAuth} />}
          label={t(`settings.advanced.oauth`)}
        />
      </Grid>
      <Grid size="auto">
        <FormControlLabel
          control={<Switch checked={Boolean(registration)} onChange={toggleRegistration} />}
          label={t(`settings.advanced.registration`)}
        />
      </Grid>
    </Grid>
  );
};

export default SystemSettings;
