import { getInstanceSettings, setAllowRegistration, setInstanceOnlineMode, setOauthStatus } from '@/services/config';
import { ConfigResponse, InstanceResponse } from '@/types/Generics';
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

const SystemSettings: React.FC<Props> = ({ config, settings, onReload }) => {
  const { t } = useTranslation();

  const isInitialMount = useRef(true);
  const [online, setOnline] = useState<boolean>(
    settings?.online_mode !== undefined ? Boolean(settings?.online_mode) : true
  );
  const [oAuth, setOAuth] = useState<boolean>(Boolean(config?.enable_oauth));
  const [registration, setRegistration] = useState<boolean>(Boolean(config?.allow_registration));

  const getOnlineStatus = async () => {
    const response = await getInstanceSettings();
    if (response.data) onReload();
  };

  const toggleOnline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(!event.target.checked);
  };

  const toggleOAuth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOAuth(event.target.checked);
  };

  const toggleRegistration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(event.target.checked);
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
    setInstanceOnlineMode(online ? 1 : 0);
  }, [online]);

  useEffect(() => {
    if (settings?.online_mode !== undefined) {
      setOnline(Boolean(settings.online_mode));
    }
  }, [settings?.online_mode]);

  useEffect(() => {
    if (isInitialMount.current) return;
    setOauthStatus(oAuth);
  }, [oAuth]);

  useEffect(() => {
    if (isInitialMount.current) return;
    setAllowRegistration(registration);
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
