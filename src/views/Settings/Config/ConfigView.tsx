import { AppIcon } from '@/components';
import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';
import LoginSettings from './LoginSettings';
import SchoolDelete from './SchoolDelete';
import SchoolInfo from './SchoolInfo';
import SystemSettings from './SystemSettings';
import TimeSettings from './TimeSettings';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ConfigResponse>();
  const [settings, setSettings] = useState<InstanceResponse>();

  const getConfig = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getGlobalConfig',
      arguments: {},
    }).then((response) => {
      if (response.success) {
        setConfig(response.data);
      }
    });
  };

  const getSettings = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.success) setSettings(response.data);
    });
  };

  const loadData = () => {
    getConfig();
    getSettings();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4" pb={2}>
        {t('views.configuration')}
      </Typography>
      {config && <SchoolInfo config={config} onReload={getConfig} />}
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.settings`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">{t('settings.categories')}</Typography>
          <Categories />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.time`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{config && <TimeSettings config={config} onReload={getConfig} />}</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.login`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {config && settings && <LoginSettings config={config} settings={settings} onReload={loadData} />}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.system`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{settings && <SystemSettings settings={settings} onReload={getSettings} />}</AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.advanced`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">Deactivate</Typography>
        </AccordionDetails>
      </Accordion> */}
      <Accordion>
        <AccordionSummary
          expandIcon={<AppIcon icon="arrowdown" />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{
            backgroundColor: red[100],
          }}
        >
          <Typography variant="h5" py={1}>
            {t(`settings.danger`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SchoolDelete />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default ConfigView;
