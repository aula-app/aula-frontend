import AppIcon from '@/components/AppIcon';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: React.ReactNode;
}

/**
 * Renders "AdvancedFields" component
 */

const AdvancedFields: React.FC<Props> = ({ children, ...restOfProps }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded}>
      <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>{t('settings.advanced.headline')}</AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
          {children}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedFields;
