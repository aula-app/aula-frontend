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
import Groups from './Groups';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ConfigResponse>();
  const [settings, setSettings] = useState<InstanceResponse>();
  const [expanded, setExpanded] = useState<string | null>(null);

  const getConfig = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getGlobalConfig',
      arguments: {},
    }).then((response) => {
      if (response.success) {
        setConfig(response.data);
        setExpanded(null);
      }
    });
  };

  const getSettings = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getInstanceSettings',
      arguments: {},
    }).then((response) => {
      if (response.success) {
        setSettings(response.data);
        setExpanded(null);
      }
    });
  };

  const loadData = () => {
    getConfig();
    getSettings();
  };

  const toggleExpanded = (pannel: string) => {
    expanded !== pannel ? setExpanded(pannel) : setExpanded(null);
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
      <Accordion expanded={expanded === 'panel0'} onChange={() => toggleExpanded('panel0')}>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
          <Typography variant="h5" py={1}>
            {t(`settings.settings`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">{t('settings.categories')}</Typography>
          <Categories />
          <Typography variant="h6">{t('settings.groups')}</Typography>
          <Groups />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel1'} onChange={() => toggleExpanded('panel1')}>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
          <Typography variant="h5" py={1}>
            {t(`settings.time`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{config && <TimeSettings config={config} onReload={getConfig} />}</AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={() => toggleExpanded('panel2')}>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
          <Typography variant="h5" py={1}>
            {t(`settings.login`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {config && settings && <LoginSettings config={config} settings={settings} onReload={loadData} />}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={() => toggleExpanded('panel3')}>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
          <Typography variant="h5" py={1}>
            {t(`settings.system`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{settings && <SystemSettings settings={settings} onReload={getSettings} />}</AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={() => toggleExpanded('panel4')}>
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
