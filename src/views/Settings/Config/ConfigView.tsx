import { AppIcon } from '@/components';
import { getInstanceSettings } from '@/services/config';
import { useAppStore } from '@/store/AppStore';
import { InstanceResponse } from '@/types/Generics';
import { checkPermissions } from '@/utils';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Groups from './Groups';
import IdeaSettings from './IdeaSettings';
import QuorumSettings from './IdeaSettings/QuorumSettings';
import SchoolDelete from './SchoolDelete';
import SchoolInfo from './SchoolInfo';
import TimedCommands from './TimedCommands';
import UsersSettings from './UsersSettings';
import SystemSettings from './SystemSettings';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();
  const [settings, setSettings] = useState<InstanceResponse>();
  const [expanded, setExpanded] = useState<string>();

  const getSettings = async () => {
    const response = await getInstanceSettings();
    if (!response.data) return;
    setSettings(response.data);
    setExpanded(undefined);
  };

  const loadData = () => {
    getSettings();
  };

  const toggleExpanded = (panel: string) => {
    expanded !== panel ? setExpanded(panel) : setExpanded(undefined);
  };

  const closePanels = () => setExpanded(undefined);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.configuration'), '']] });
    loadData();
  }, []);

  const panels = [
    { name: 'idea', component: <IdeaSettings onReload={closePanels} /> },
    { name: 'vote', component: <QuorumSettings onReload={closePanels} /> },
    { name: 'user', component: <UsersSettings onReload={closePanels} /> },
    { name: 'group', component: <Groups /> },
    // { name: 'time', component: <TimeSettings config={config} onReload={getConfig} /> },
    // { name: 'login', component: <LoginSettings config={config} settings={settings} onReload={loadData} /> },
    { name: 'action', component: <TimedCommands /> },
    { name: 'system', component: <SystemSettings settings={settings} onReload={getSettings} /> },
    { name: 'danger', component: <SchoolDelete /> },
  ];

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h1" pb={2}>
        {t('settings.labels.configuration')}
      </Typography>
      <SchoolInfo />
      <div role="tablist" aria-label={t('settings.labels.configuration')}>
        {panels.map(
          (panel, i) =>
            checkPermissions('configs', panel.name) && (
              <Accordion key={panel.name} expanded={expanded === `panel${i}`} onChange={() => toggleExpanded(`panel${i}`)}>
                <AccordionSummary
                  expandIcon={<AppIcon icon="arrowdown" />}
                  role="tab"
                  id={`tab-${panel.name}`}
                  data-testid={`config-accordion-${panel.name}`}
                  aria-controls={`panel-${panel.name}`}
                  aria-expanded={expanded === `panel${i}`}
                >
                  <Typography variant="h2" py={1}>
                    {t(`settings.panels.${panel.name}`)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails role="tabpanel" id={`panel-${panel.name}`} aria-labelledby={`tab-${panel.name}`}>
                  {panel.component}
                </AccordionDetails>
              </Accordion>
            )
        )}
      </div>
      {/* <Skeleton variant="rectangular" width="100%" height={45} sx={{ mt: 3 }} /> */}
    </Stack>
  );
};

export default ConfigView;
