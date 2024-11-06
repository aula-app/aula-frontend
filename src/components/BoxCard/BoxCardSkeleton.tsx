import { Card, CardContent, Skeleton } from '@mui/material';

const BoxCardSkeleton = () => (
  <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
    <Skeleton variant="rectangular" height={48} />
    <CardContent>
      <Skeleton variant="text" width={150} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width={150} />
      <Skeleton
        variant="rectangular"
        height={24}
        sx={{
          mt: 2,
          borderRadius: 999,
        }}
      />
    </CardContent>
  </Card>
);

export default BoxCardSkeleton;
