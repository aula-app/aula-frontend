import { AppIcon } from '@/components';
import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { checkPermissions, databaseRequest } from '@/utils';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Stack, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';
import LoginSettings from './LoginSettings';
import SchoolDelete from './SchoolDelete';
import SchoolInfo from './SchoolInfo';
import SystemSettings from './SystemSettings';
import TimeSettings from './TimeSettings';
import Groups from './Groups';
import TimedCommands from './TimedCommands';
import IdeaSettings from './IdeaSettings';
import UsersSettings from './UsersSettings';
import { getGlobalConfigs, getInstanceSettings } from '@/services/config';
import QuorumSettings from './IdeaSettings/QuorumSettings';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ConfigResponse>();
  const [settings, setSettings] = useState<InstanceResponse>();
  const [expanded, setExpanded] = useState<string>();

  const getConfig = async () => {
    const response = await getGlobalConfigs();
    if (!response.data) return;
    setConfig(response.data);
    setExpanded(undefined);
  };

  const getSettings = async () => {
    const response = await getInstanceSettings();
    if (!response.data) return;
    setSettings(response.data);
    setExpanded(undefined);
  };

  const loadData = () => {
    getConfig();
    getSettings();
  };

  const toggleExpanded = (panel: string) => {
    expanded !== panel ? setExpanded(panel) : setExpanded(undefined);
  };

  const closePanels = () => setExpanded(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const SETTINGS_PANELS = [
    // { name: 'category', role: 30, component: <Categories /> },
    { name: 'idea', role: 50, component: <IdeaSettings onReload={getConfig} /> },
    { name: 'vote', role: 50, component: <QuorumSettings onReload={closePanels} /> },
    { name: 'user', role: 50, component: <UsersSettings onReload={closePanels} /> },
    { name: 'group', role: 50, component: <Groups /> },
    { name: 'time', role: 50, component: <TimeSettings config={config} onReload={getConfig} /> },
    { name: 'login', role: 50, component: <LoginSettings config={config} settings={settings} onReload={loadData} /> },
    { name: 'action', role: 50, component: <TimedCommands /> },
    { name: 'system', role: 50, component: <SystemSettings settings={settings} onReload={getSettings} /> },
    { name: 'danger', role: 50, component: <SchoolDelete /> },
  ];

  const panels = SETTINGS_PANELS.filter((panel) => checkPermissions(panel.role));

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4" pb={2}>
        {t('settings.labels.configuration')}
      </Typography>
      <SchoolInfo config={config} onReload={getConfig} />
      {panels.map((panel, i) => (
        <Accordion key={i} expanded={expanded === `panel${i}`} onChange={() => toggleExpanded(`panel${i}`)}>
          <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
            <Typography variant="h5" py={1}>
              {t(`settings.panels.${panel.name}`)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{panel.component}</AccordionDetails>
        </Accordion>
      ))}
      {/* <Skeleton variant="rectangular" width="100%" height={45} sx={{ mt: 3 }} /> */}
    </Stack>
  );
};

export default ConfigView;
