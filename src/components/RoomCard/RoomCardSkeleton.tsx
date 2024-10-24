import PhaseBarSkeleton from '@/layout/PhaseBar/PhaseBarSkeleton';
import { Card, Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';

/**
 * Renders "Skeleton" component
 */
const RoomCardSkeleton = () => {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
      <Card sx={{ borderRadius: '25px' }} variant="outlined">
        <Stack
          sx={{
            flex: 1,
            p: 2,
          }}
        >
          <Skeleton variant="rectangular" sx={{ mb: 2 }} />
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: '10px', objectFit: 'cover', flex: 1, aspectRatio: '1.33', width: '100%' }}
          />
        </Stack>
        <PhaseBarSkeleton />
      </Card>
    </Grid>
  );
};

export default RoomCardSkeleton;
