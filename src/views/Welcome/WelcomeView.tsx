import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { getRooms } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { RoomType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard from './Dashboard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [showDashboard, setShowDashboard] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const [, dispatch] = useAppStore();

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setShowDashboard(scrollTop === 0);
  }, []);

  const fetchRooms = useCallback(async () => {
    const response = await getRooms({
      offset: 0,
      limit: 0,
      type: -1,
    });
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setRooms(response.data);
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
    fetchRooms();
  }, [dispatch, fetchRooms]);

  return (
    <Stack height="100%" sx={{ p: { md: 1 } }} role="main" aria-label={t('ui.navigation.home')}>
      <Dashboard show={showDashboard} />
      <Stack
        flexGrow={1}
        position="relative"
        onScroll={handleScroll}
        gap={2}
        sx={{
          px: 2,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
        role="region"
        aria-label={t('scopes.rooms.plural')}
        tabIndex={0}
      >
        <Typography
          variant="h1"
          className="noSpace"
          sx={{
            pt: 2,
            scrollSnapAlign: 'start',
            transition: 'all .5s ease-in-out',
          }}
          component="h1"
          id="rooms-heading"
        >
          {t('scopes.rooms.plural')}
        </Typography>
        <Grid
          container
          spacing={2}
          role="list"
          aria-labelledby="rooms-heading"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && <RoomCardSkeleton />}
          {error && <Typography color="error">{t('errors.default')}</Typography>}
          {rooms.map((room) => (
            <RoomCard room={room} />
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
