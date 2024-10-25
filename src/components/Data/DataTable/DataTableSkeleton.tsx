import { Divider, Skeleton, Stack } from '@mui/material';

export default function DataTableSkeleton() {
  return (
    <Stack flex={1}>
      <Divider />
      <Stack direction="row" height={56} justifyContent="space-around" alignItems="center">
        <Skeleton variant="text" width={20} height={30} />
        {[...Array(7)].map(() => (
          <Skeleton variant="text" width="10%" height={30} />
        ))}
      </Stack>
      <Divider />
      {[...Array(7)].map(() => (
        <Skeleton variant="rectangular" height={42} sx={{ mt: 0.5 }} />
      ))}
    </Stack>
  );
}
