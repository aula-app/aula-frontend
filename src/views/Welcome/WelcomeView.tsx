import { useAppStore } from '@/store';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/usePageTitle';
import Rooms from '@/v2/views/private/Rooms';
import Dashboard from './Dashboard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  usePageTitle('pageTitles.welcome');

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
  }, [dispatch]);

  return (
    <Stack flex={1} role="main" aria-label={t('ui.navigation.home')} sx={{ minHeight: 0, overflow: 'hidden' }}>
      <Dashboard />
      <Rooms />
    </Stack>
  );
};

export default WelcomeView;
