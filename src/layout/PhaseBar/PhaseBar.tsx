import { AppIcon, AppLink } from '@/components';
import { phases } from '@/utils/phases';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

/**
 * Renders TopBar composition
 * @component PhaseBar
 */

const PhaseBar = () => {
  const params = useParams();
  const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
  const location = useLocation().pathname.split('/');
  const [currentPhase, setPhase] = useState('ideas');

  const getPhase = () => setPhase(params.phase && Object.keys(phases).includes(params.phase) ? params.phase : '');

  useEffect(getPhase, [location.join('/')]);

  return (
    <Stack direction="row" overflow="clip" width="100%">
      {displayPhases.map((phase) => (
        <AppLink
          key={phase}
          to={`${location.slice(0, 3).join('/')}/phase/${phase}`}
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
            pl={phase === "0" ? 2 : 1}
            pr={currentPhase === phase ? 3 : 1}
            height="100%"
            sx={{
              bgcolor: phases[phase].color,
            }}
          >
            <AppIcon name={phases[phase].icon} size="small" />
            <Typography noWrap overflow="ellipsis" pl={1} fontSize="small">
              {currentPhase === phase ? phases[phase].name : ''}
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
              pointerEvents: 'none'
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
              pointerEvents: 'none'
            }}
          ></Box>
        </AppLink>
      ))}
    </Stack>
  );
};

export default PhaseBar;
