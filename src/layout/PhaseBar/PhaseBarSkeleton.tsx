import { AppIcon, AppLink } from '@/components';
import { phases } from '@/utils';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

/**
 * Renders TopBar composition
 * @component PhaseBar
 */

const PhaseBarSkeleton = () => {
  const displayPhases = Object.keys(phases) as Array<keyof typeof phases>;

  return (
    <Stack direction="row" overflow="clip" width="100%">
      {displayPhases.map((phase, i) => (
        <Skeleton
          variant="rectangular"
          sx={{
            height: '36px',
            mx: '-6px',
            flex: 1,
            clipPath: `polygon(0% 0%, ${i > 0 ? '16px 50%,' : ''} 0% 100%, calc(100% - 16px) 100%, 100% 50%, ${i !== displayPhases.length - 1 ? 'calc(100% - 16px)' : '100%'} 0%)`,
          }}
        />
      ))}
    </Stack>
  );
};

export default PhaseBarSkeleton;
