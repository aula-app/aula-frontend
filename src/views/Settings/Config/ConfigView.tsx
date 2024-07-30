import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();

  // Missing endpoint for categories

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">{t('views.config')}</Typography>
      <Typography variant="h6">{t('settings.categories')}</Typography>
      <Categories />
    </Stack>
  );
};

export default ConfigView;
