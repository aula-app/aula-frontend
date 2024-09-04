import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * "OfflineView"
 */
const OfflineView = () => {
  const { t } = useTranslation();
  return (
    <Stack height="100vh" alignItems="center" justifyContent="center" p={4}>
      <img src="/img/aula_happy.png" alt="Not found" loading="lazy" width={150} />
      <Typography variant="h6" mt={6} textAlign="center">
        {t('views.offline')}
      </Typography>
    </Stack>
  );
};

export default OfflineView;
