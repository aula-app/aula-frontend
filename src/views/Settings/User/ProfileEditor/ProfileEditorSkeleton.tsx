import { Skeleton, Stack } from '@mui/material';

/** * Renders "SystemSettings" component
 */

const ProfileEditorSkeleton = () => (
  <Stack p={2} gap={5} mb={1.5}>
    <Skeleton variant="circular" width={56} height={56} sx={{ alignSelf: 'center' }} />
    {[...Array(3)].map((a, i) => (
      <Stack direction="row" justifyContent="space-between" key={i}>
        <Skeleton variant="rectangular" height={48} width="calc(100% - 60px)" />
        <Skeleton variant="circular" width={36} height={36} sx={{ alignSelf: 'center' }} />
      </Stack>
    ))}
    <Skeleton variant="rectangular" height={48} width="calc(100%)" />
    <Skeleton variant="rectangular" height={148} width="calc(100%)" />
    <Skeleton variant="rectangular" height={36.5} width={75} sx={{ alignSelf: 'end' }} />
  </Stack>
);

export default ProfileEditorSkeleton;
