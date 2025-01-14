import { AppIcon } from '@/components';
import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { checkPermissions, databaseRequest } from '@/utils';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Stack, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { useEffect, useState } from 'react';
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

  const toggleExpanded = (panel: string) => {
    expanded !== panel ? setExpanded(panel) : setExpanded(null);
  };

  const closePanels = () => setExpanded(null);

  useEffect(() => {
    loadData();
  }, []);

  const SETTINGS_PANELS = [
    { name: 'category', role: 30, component: <Categories /> },
    { name: 'group', role: 50, component: <Groups /> },
    { name: 'idea', role: 50, component: <IdeaSettings onReload={getConfig} /> },
    { name: 'user', role: 50, component: <UsersSettings onReload={closePanels} /> },
    { name: 'time', role: 60, component: <TimeSettings config={config} onReload={getConfig} /> },
    { name: 'login', role: 60, component: <LoginSettings config={config} settings={settings} onReload={loadData} /> },
    { name: 'action', role: 60, component: <TimedCommands /> },
    { name: 'system', role: 60, component: <SystemSettings settings={settings} onReload={getSettings} /> },
    { name: 'danger', role: 60, component: <SchoolDelete /> },
  ];

  const panels = SETTINGS_PANELS.filter((panel) => checkPermissions(panel.role));

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4" pb={2}>
        {t('settings.labels.configuration')}
      </Typography>
      <SchoolInfo config={config} onReload={getConfig} />
      {panels.map((panel, i) => (
        <>
          {settings && config ? (
            <Accordion expanded={expanded === `panel${i}`} onChange={() => toggleExpanded(`panel${i}`)} key={i}>
              <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>
                <Typography variant="h5" py={1}>
                  {t('settings.advanced.system', { var: t(`settings.panels.${panel.name}`) })}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{panel.component}</AccordionDetails>
            </Accordion>
          ) : (
            <Skeleton key={i} variant="rectangular" width="100%" height={45} sx={{ mt: 3 }} />
          )}
        </>
      ))}
    </Stack>
  );
};

export default ConfigView;
