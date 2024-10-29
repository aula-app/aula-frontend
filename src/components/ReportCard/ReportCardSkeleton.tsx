import { Card, CardActions, CardContent, Divider, Skeleton, Stack } from '@mui/material';

/**
 * Renders "ReportCardSkeleton" component
 */

const ReportCardSkeleton = () => (
  <Card variant="outlined" sx={{ borderRadius: 5, overflow: 'visible' }}>
    <CardContent>
      <Skeleton variant="rectangular" height={24} width="30%" />
    </CardContent>
    <Divider />
    <CardContent>
      {[...Array(3)].map((item, i) => (
        <Stack direction="row" gap={1} key={i}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={120} />
        </Stack>
      ))}
    </CardContent>
    <Divider />
    <CardContent>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="75%" />
    </CardContent>
    <Divider />
    <CardActions>
      <Skeleton variant="rectangular" width={100} sx={{ ml: 'auto', mr: 2, my: 1 }} />
    </CardActions>
  </Card>
);

export default ReportCardSkeleton;
