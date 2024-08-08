import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * "Not Found" aka "Error 404" view
 */
const NotFoundViewView = () => {
  const { t } = useTranslation();
  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <img src="/img/aula_happy.png" alt="Not found" loading="lazy" width={150} />
      <Typography variant="h6" mt={2}>
        {t('views.notFound')}
      </Typography>
    </Stack>
  );
};

export default NotFoundViewView;
