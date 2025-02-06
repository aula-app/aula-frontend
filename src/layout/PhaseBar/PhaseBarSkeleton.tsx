import { phases } from '@/utils';
import { RoomPhases } from '@/types/SettingsTypes';
import { Skeleton, Stack } from '@mui/material';

import { phaseStyles } from './styles';

/**
 * Renders a loading skeleton for the phase navigation bar
 * @component PhaseBarSkeleton
 */

const PhaseBarSkeleton = () => {
  const displayPhases = Object.keys(phases).map(Number) as RoomPhases[];

  return (
    <Stack direction="row" overflow="clip" width="100%" minHeight={phaseStyles.height}>
      {displayPhases.map((phase, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{
            height: phaseStyles.height,
            mx: `-${phaseStyles.spacing / 2}px`,
            flex: 1,
            clipPath: `polygon(0% 0%, ${i > 0 ? '16px 50%,' : ''} 0% 100%, calc(100% - 16px) 100%, 100% 50%, ${i !== displayPhases.length - 1 ? 'calc(100% - 16px)' : '100%'} 0%)`,
          }}
        />
      ))}
    </Stack>
  );
};

export default PhaseBarSkeleton;
