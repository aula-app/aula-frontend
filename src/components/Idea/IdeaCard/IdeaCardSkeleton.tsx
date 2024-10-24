import { Card, Skeleton, Stack } from '@mui/material';

/**
 * Renders "IdeaCard" component
 */

const IdeaCardSkeleton = () => (
  <Card
    sx={{
      borderRadius: '25px',
      overflow: 'hidden',
      scrollSnapAlign: 'center',
    }}
    variant="outlined"
  >
    <Stack direction="row" height={68} p={2} alignItems="center">
      <Skeleton variant="circular" width={32} height={32} />
      <Stack pl={2} flex={1}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="100%" />
      </Stack>

      <Stack
        pl={2}
        ml={2}
        borderLeft="1px solid #ccc"
        justifyContent="space-between"
        height="100%"
        sx={{ aspectRatio: 1 }}
      >
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="circular" width={14} height={14} />
      </Stack>
    </Stack>
  </Card>
);

export default IdeaCardSkeleton;
