import { AppLink } from '@/components';
import { useAppStore } from '@/store';
import { Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface OfflineViewProps {
  className?: string;
}

/**
 * View displayed when school is closed (online_mode !== 1)
 */
const PublicOfflineView: React.FC<OfflineViewProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <img src="/img/Paula_schlafend.svg" alt={t('errors.schoolClosedImage')} role="img" loading="lazy" width={150} />
      <Typography mt={6}>
        {t('errors.schoolClosed')}
      </Typography>
      <AppLink color="success" to="/">
        {t('auth.login.button')}
      </AppLink>
    </Stack>
  );
};

export default PublicOfflineView;
