import { AppIcon, AppLink } from '@/components';
import { phases } from '@/utils';
import { RoomPhases } from '@/types/SettingsTypes';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import { PHASE_CLIP_PATH, phaseStyles } from './styles';

interface PhaseBarProps {
  /** Room identifier for phase navigation */
  room: string;
}

const isValidPhase = (phase: string): phase is `${RoomPhases}` => Object.keys(phases).includes(phase);

/**
 * Renders the phase navigation bar showing the room's workflow progression
 * @component PhaseBar
 */
const PhaseBar: React.FC<PhaseBarProps> = ({ room }) => {
  const { t } = useTranslation();
  const { phase } = useParams();
  const displayPhases = Object.keys(phases);
  const [currentPhase, setPhase] = useState<`${RoomPhases}`>('0');

  const getPhase = useCallback(() => {
    if (phase && isValidPhase(phase)) {
      setPhase(phase);
    } else {
      setPhase('0');
    }
  }, [phase]);

  useEffect(() => {
    getPhase();
  }, [getPhase, useLocation().pathname]);

  return (
    <Stack direction="row" overflow="clip" width="100%" minHeight={phaseStyles.height}>
      {displayPhases.map((displayPhase) => (
        <AppLink
          key={displayPhase}
          data-testid={`link-to-phase-${displayPhase}`}
          to={`/room/${room}/phase/${displayPhase}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flex: currentPhase === displayPhase ? 3 : 1,
            position: 'relative',
          }}
        >
          <Tooltip arrow title={t(`tooltips.${phases[displayPhase as `${RoomPhases}`]}`)}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              p={1}
              pl={displayPhase === '0' ? 2 : 1}
              pr={currentPhase === `${phase}` ? 3 : 1}
              mx={`-${phaseStyles.spacing}px`}
              height={phaseStyles.height}
              sx={{
                bgcolor: `${phases[displayPhase as `${RoomPhases}`]}.main`,
                clipPath: PHASE_CLIP_PATH,
              }}
            >
              <AppIcon icon={phases[displayPhase as `${RoomPhases}`]} />
              <Typography noWrap overflow="ellipsis" pl={1} fontSize="small">
                {currentPhase === `${displayPhase}` ? t(`phases.${phases[displayPhase as `${RoomPhases}`]}`) : ''}
              </Typography>
            </Stack>
          </Tooltip>
        </AppLink>
      ))}
    </Stack>
  );
};

export default PhaseBar;
