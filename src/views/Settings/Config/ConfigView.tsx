import { AppIcon } from '@/components';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';
import SchoolInfo from './SchoolInfo';
import SystemSettings from './SystemSettings';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4" pb={2}>
        {t('views.configuration')}
      </Typography>
      <SchoolInfo />
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
            {t(`settings.system`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SystemSettings />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.advanced`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">Deactivate</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h5" py={1}>
            {t(`settings.danger`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">Deactivate</Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default ConfigView;
