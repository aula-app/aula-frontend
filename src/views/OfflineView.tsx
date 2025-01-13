import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { logout } from '@/services/login';

const OFFLINE_IMAGE = '/img/aula_happy.png';

interface OfflineViewProps {
  className?: string;
}

/**
 * View displayed when application is offline
 */
const OfflineView: React.FC<OfflineViewProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center" p={4}>
      <Button color="error" sx={{ position: 'absolute', top: 10, left: 10 }} onClick={logout}>
        &lt; {t('login.exit')}
      </Button>
      <img src={OFFLINE_IMAGE} alt="Offline status" loading="lazy" width={150} />
      <Typography variant="h6" mt={6} textAlign="center">
        {t('views.offline')}
      </Typography>
    </Stack>
  );
};

export default OfflineView;
