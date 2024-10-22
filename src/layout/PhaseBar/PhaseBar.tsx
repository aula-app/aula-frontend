import { AppIcon, AppLink } from '@/components';
import { phases } from '@/utils';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
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
            flex: currentPhase === phase ? 3 : 1,
            position: 'relative',
          }}
        >
          <Tooltip arrow title={t(`tooltips.${phases[phase].name}`)}>
            <Stack
              key={phase}
              direction="row"
              alignItems="center"
              justifyContent="center"
              p={1}
              pl={phase === '0' ? 2 : 1}
              pr={currentPhase === phase ? 3 : 1}
              mx="-16px"
              height="24"
              sx={{
                bgcolor: `${phases[phase].name}.main`,
                clipPath: 'polygon(0% 0%, 16px 50%, 0% 100%, calc(100% - 16px) 100%, 100% 50%, calc(100% - 16px) 0%)',
              }}
            >
              <AppIcon icon={phases[phase].name} />
              <Typography noWrap overflow="ellipsis" pl={1} fontSize="small">
                {currentPhase === phase ? t(`phases.${phases[phase].name}`) : ''}
              </Typography>
            </Stack>
          </Tooltip>
        </AppLink>
      ))}
    </Stack>
  );
};

export default PhaseBar;
