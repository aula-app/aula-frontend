import { EmptyState, ErrorState } from '@/components';
import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RoomsView = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ROOM_GRID_SIZE = { xs: 12, sm: 6, lg: 4, xl: 3 };
  const FULL_GRID_SIZE = 12;

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRooms({
        offset: 0,
        limit: 0,
        type: -1,
      });

      if (response.error) {
        setError(response.error);
        setRooms([]);
      } else if (response.data) {
        setRooms(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load rooms');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <Stack
      flexGrow={1}
      position="relative"
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
      {error ? (
        <ErrorState onClick={fetchRooms} />
      ) : (
        <Grid
          container
          spacing={2}
          role="list"
          aria-labelledby="rooms-heading"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <Grid size={ROOM_GRID_SIZE}>
              <RoomCardSkeleton />
            </Grid>
          ) : rooms.length === 0 ? (
            <Grid size={FULL_GRID_SIZE}>
              <EmptyState title={t('ui.empty.rooms.title')} description={t('ui.empty.rooms.description')} />
            </Grid>
          ) : (
            rooms.map((room) => (
              <Grid size={ROOM_GRID_SIZE} sx={{ scrollSnapAlign: 'center', order: -room.type }} key={room.hash_id}>
                <RoomCard room={room} />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Stack>
  );
};

export default RoomsView;
