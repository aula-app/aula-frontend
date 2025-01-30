import AppIcon from '@/components/AppIcon';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectField from './SelectField';
import { Control } from 'react-hook-form';
import { STATUS } from '@/utils/Data/formDefaults';

interface Props {
  control: Control<any, any>;
  children?: React.ReactNode;
}

/**
 * Renders "AdvancedFields" component
 */

const AdvancedFields: React.FC<Props> = ({ children, control, ...restOfProps }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded}>
      <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />}>{t('settings.advanced.headline')}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AdvancedFields;
