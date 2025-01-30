import { Skeleton, Stack } from '@mui/material';

/** * Renders "SystemSettings" component
 */

const ProfileEditorSkeleton = () => (
  <Stack direction="row" flexWrap="wrap" p={2} gap={2}>
    <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto' }} />
    <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
      {[...Array(4)].map((a, i) => (
        <Skeleton key={i} variant="rectangular" height={42} />
      ))}
    </Stack>
    <Skeleton variant="rectangular" height="100%" sx={{ flex: 2 }} />
  </Stack>
);

export default ProfileEditorSkeleton;
