import { AppIcon } from '@/components';
import { phases } from '@/utils/phases';
import { Link, Stack } from '@mui/material';
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
  const [currentPhase, setPhase] = useState('ideas')

  const getPhase = () => setPhase(params.phase && Object.keys(phases).includes(params.phase) ? params.phase : 'ideas')

  useEffect(getPhase, [location.join('/')])

  return (
    <Stack direction="row" py={1}>
      {displayPhases.map((phase) => (
        <Link
          key={phase}
          href={`${location.slice(0, 3).join('/')}/${phase}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flex: phase === currentPhase ? 1 : 0
          }}>
          <Stack
            key={phase}
            direction="row"
            alignItems="center"
            p={1}
            mx={0.5}
            sx={{
              bgcolor: phases[phase].color,
              borderRadius: 999,
            }}
          >
            <AppIcon name={phases[phase].icon} />
            {currentPhase === phase ? phases[phase].name : ''}
          </Stack>
        </Link>
      ))}
    </Stack>
  );
};

export default PhaseBar;
