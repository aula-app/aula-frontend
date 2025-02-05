import { Divider, Skeleton, Stack } from '@mui/material';

export default function DataTableSkeleton() {
  return (
    <Stack gap={0.5}>
      {[...Array(7)].map((x, j) => (
        <Skeleton variant="rectangular" height={40} key={j} />
      ))}
    </Stack>
  );
}
