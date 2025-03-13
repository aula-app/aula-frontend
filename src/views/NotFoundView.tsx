import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * "Not Found" aka "Error 404" view component
 * @returns React component displaying 404 error page
 */
const NotFoundView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <img src="/img/Paula_schlafend.svg" alt="Not found" loading="lazy" width={150} />
      <Typography variant="h6" mt={2}>
        {t('errors.notFound')}
      </Typography>
    </Stack>
  );
};

export default NotFoundView;
