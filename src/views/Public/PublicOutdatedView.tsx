import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PublicOutdatedView = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} alignItems="center" sx={{ p: 2 }}>
      <img src="/img/Paula_zwinkernd.svg" alt={t('errors.appOutdatedImage')} role="img" loading="lazy" width={150} />
      <Typography mt={6}>{t('errors.appOutdated')}</Typography>
    </Stack>
  );
};

export default PublicOutdatedView;
