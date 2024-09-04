import { AppIcon } from '@/components';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';
import SchoolInfo from './SchoolInfo';
import SystemSettings from './SystemSettings';
import { red } from '@mui/material/colors';
import SchoolDelete from './SchoolDelete';
import TimeSettings from './TimeSettings';
import LoginSettings from './LoginSettings';
import { databaseRequest } from '@/utils';
import { useEffect, useState } from 'react';
import { ConfigResponse, SingleResponseType } from '@/types/Generics';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ConfigResponse>();

  const getConfig = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getGlobalConfig',
      arguments: {},
    }).then((response) => {
      if (response.success) {
        console.log(response);
        setConfig(response.data);
      }
    });
  };

  useEffect(() => {
    getConfig();
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
        <AccordionDetails>{config && <TimeSettings config={config} onRelod={getConfig} />}</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.login`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{config && <LoginSettings config={config} onRelod={getConfig} />}</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.system`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SystemSettings />
        </AccordionDetails>
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
