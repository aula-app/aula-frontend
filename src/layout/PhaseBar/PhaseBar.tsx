import { AppIcon, AppLink } from '@/components';
import { phases } from '@/utils/phases';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

/**
 * Renders TopBar composition
 * @component PhaseBar
 */

const PhaseBar = ({ room }: { room: number }) => {
  const { t } = useTranslation();
  const params = useParams();
  const displayPhases = Object.keys(phases) as Array<keyof typeof phases>;
  const [currentPhase, setPhase] = useState('ideas');

  const getPhase = () => setPhase(params.phase && Object.keys(phases).includes(params.phase) ? params.phase : '');

  useEffect(getPhase, [useLocation().pathname]);

  return (
    <Stack direction="row" overflow="clip" width="100%">
      {displayPhases.map((phase) => (
        <AppLink
          key={phase}
          to={`/room/${room}/phase/${phase}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flex: 1,
            position: 'relative',
          }}
        >
          <Stack
            key={phase}
            direction="row"
            alignItems="center"
            justifyContent="center"
            p={1}
            pl={phase === '0' ? 2 : 1}
            pr={currentPhase === phase ? 3 : 1}
            height="100%"
            sx={{
              bgcolor: phases[phase].color,
            }}
          >
            <AppIcon name={phases[phase].name} />
            <Typography noWrap overflow="ellipsis" pl={1} fontSize="small">
              {currentPhase === phase ? t(`phases.${phases[phase].name}`) : ''}
            </Typography>
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              height: '50%',
              aspectRatio: 1,
              top: 0,
              transform: 'translateX(-100%)',
              clipPath: 'polygon(0% 0%, 100% 100%, 100% 0%)',
              bgcolor: phases[phase].color,
              pointerEvents: 'none',
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              height: '50%',
              aspectRatio: 1,
              bottom: 0,
              transform: 'translateX(-100%)',
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)',
              bgcolor: phases[phase].color,
              pointerEvents: 'none',
            }}
          ></Box>
        </AppLink>
      ))}
    </Stack>
  );
};

export default PhaseBar;
