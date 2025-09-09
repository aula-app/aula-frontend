import { AppLink } from '@/components';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * View displayed when school is closed (online_mode !== 1)
 */
const PublicOfflineView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack flex={1} alignItems="center" justifyContent="center" data-testid="school-offline-view">
      <img 
        src="/img/Paula_schlafend.svg" 
        alt={t('errors.schoolClosedImage')} 
        role="img" 
        loading="lazy" 
        width={150}
        data-testid="school-offline-image"
      />
      <Typography mt={6} data-testid="school-offline-message">
        {t('errors.schoolClosed')}
      </Typography>
      <AppLink color="success" to="/" data-testid="school-offline-login-link">
        {t('auth.login.button')}
      </AppLink>
    </Stack>
  );
};

export default PublicOfflineView;
