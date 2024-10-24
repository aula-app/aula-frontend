import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import MoreOptions from '@/components/MoreOptions';
import { BoxType } from '@/types/Scopes';
import { checkPermissions, databaseRequest, phases } from '@/utils';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
