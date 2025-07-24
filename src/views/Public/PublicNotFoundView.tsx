import { AppLink } from '@/components';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} alignItems="center" sx={{ p: 2 }}>
      <img src="/img/Paula_schlafend.svg" alt={t('errors.schoolClosedImage')} role="img" loading="lazy" width={150} />
      <Typography>{t('errors.unauthorized')}</Typography>
      <AppLink color="success" to="/">
        {t('auth.login.button')}
      </AppLink>
    </Stack>
  );
};

export default PublicNotFoundView;
