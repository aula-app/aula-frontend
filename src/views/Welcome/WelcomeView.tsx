import { useAppStore } from '@/store';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard from './Dashboard';
import RoomsView from './Rooms';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
  }, [dispatch]);

  return (
    <Stack flex={1} role="main" aria-label={t('ui.navigation.home')} sx={{ minHeight: 0 }}>
      <Dashboard />
      <RoomsView />
    </Stack>
  );
};

export default WelcomeView;
