import { Skeleton, Stack } from '@mui/material';

/**
 * Renders "SchoolInfoSkeleton" component
 */

const SchoolInfoSkeleton = () => (
  <Stack gap={2}>
    <Stack gap={2} direction="row" flexWrap="wrap">
      <Skeleton variant="rectangular" sx={{ maxWidth: '500px', minWidth: 'min(300px, 100%)' }} />
      <Stack gap={2} flex={1}>
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={180} />
      </Stack>
    </Stack>
    <Stack direction="row" justifyContent="end" gap={2}>
      <Skeleton variant="rectangular" width={125} height={36} />
      <Skeleton variant="rectangular" width={65} height={36} />
    </Stack>
  </Stack>
);

export default SchoolInfoSkeleton;
