import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Renders "About" view
 * url: /about
 */
const AboutView = () => {
  const { t } = useTranslation();
  return <Box>{t('about')}</Box>;
};

export default AboutView;
