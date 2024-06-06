import { AppIcon } from '@/components';
import { allPhases, phases } from '@/utils/phases';
import { Link, Stack } from '@mui/material';
import { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Renders TopBar composition
 * @component PhaseBar
 */
const PhaseBar: FunctionComponent = ({}) => {
  const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
  const location = useLocation().pathname.split('/');
  console.log(location.includes(allPhases['wild'].path))
  return (
    <Stack direction="row" py={1}>
      {displayPhases.map((phase) => (
        <Link
          href={`${location.slice(0, 3).join('/')}/${allPhases[phase].path}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flex: location.includes(allPhases[phase].path) ? 1 : 0
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
            {location.includes(allPhases[phase].path) ? allPhases[phase].name : ''}
          </Stack>
        </Link>
      ))}
    </Stack>
  );
};

export default PhaseBar;
