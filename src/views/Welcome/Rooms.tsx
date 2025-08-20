import { EmptyState, ErrorState, ScopeHeader } from '@/components';
import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { useRoomFilters, useSearchAndSort } from '@/hooks';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

const RoomsView = () => {
  const { t } = useTranslation();

  // Manage search and sort state for the rooms view
  const { searchQuery, sortKey, sortDirection, scopeHeaderProps } = useSearchAndSort({
    sortOptions: [
      { value: 'room_name', labelKey: 'scopes.rooms.fields.name' },
      { value: 'created', labelKey: 'ui.sort.created' },
      { value: 'last_update', labelKey: 'ui.sort.updated' },
    ],
  });

  // Using the new hook with filtering and sorting capabilities
  const { rooms, isLoading, error, refetch, totalCount } = useRoomFilters({
    searchQuery,
    sortKey: (sortKey as keyof import('@/types/Scopes').RoomType) || null,
    sortDirection,
  });

  const ROOM_GRID_SIZE = { xs: 12, sm: 6, lg: 4, xl: 3 };
  const FULL_GRID_SIZE = 12;

  return (
    <Stack
      flexGrow={1}
      position="relative"
      gap={2}
      sx={{
        p: 2,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        minHeight: 0, // Allow flex child to shrink below content size
      }}
      role="region"
      aria-label={t('scopes.rooms.plural')}
      tabIndex={0}
    >
      <ScopeHeader title={t('scopes.rooms.plural')} scopeKey="rooms" totalCount={totalCount} {...scopeHeaderProps} />

      {error ? (
        <ErrorState onClick={refetch} />
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
              <Grid size={ROOM_GRID_SIZE} sx={{ scrollSnapAlign: 'center' }} key={room.hash_id}>
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
