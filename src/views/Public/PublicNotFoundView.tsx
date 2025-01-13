import { AppLink } from '@/components';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();
  
  return (
    <Stack spacing={2} alignItems="center" sx={{ p: 2 }}>
      <Typography>{t('texts.unaltenticated')}</Typography>
      <AppLink color="success" to="/">
        {t('login.signIn')}
      </AppLink>
    </Stack>
  );
};

export default PublicNotFoundView;
