import { Skeleton, Stack, StackProps } from '@mui/material';
import { FC } from 'react';

interface DataTableSkeletonProps extends StackProps {}

const DataTableSkeleton: FC<DataTableSkeletonProps> = ({ ...restOfProps }) => {
  return (
    <Stack gap={0.5} {...restOfProps}>
      {[...Array(7)].map((_, j) => (
        <Skeleton variant="rectangular" height={40} key={j} />
      ))}
    </Stack>
  );
};

export default DataTableSkeleton;
