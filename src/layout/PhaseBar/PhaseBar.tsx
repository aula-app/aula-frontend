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
  const params = useParams();
  const displayPhases = Object.keys(phases).map(Number) as RoomPhases[];
  const [currentPhase, setPhase] = useState<`${RoomPhases}`>('0');

  const getPhase = useCallback(() => {
    if (params.phase && isValidPhase(params.phase)) {
      setPhase(params.phase);
    } else {
      setPhase('0');
    }
  }, [params.phase]);

  useEffect(() => {
    getPhase();
  }, [getPhase, useLocation().pathname]);

  return (
    <Stack direction="row" overflow="clip" width="100%" minHeight={phaseStyles.height}>
      {displayPhases.map((phase) => (
        <AppLink
          key={phase}
          to={`/room/${room}/phase/${phase}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flex: currentPhase === `${phase}` ? 3 : 1,
            position: 'relative',
          }}
        >
          <Tooltip arrow title={t(`tooltips.${phases[phase]}`)}>
            <Stack
              key={phase}
              direction="row"
              alignItems="center"
              justifyContent="center"
              p={1}
              pl={phase === 0 ? 2 : 1}
              pr={currentPhase === `${phase}` ? 3 : 1}
              mx={`-${phaseStyles.spacing}px`}
              height={phaseStyles.height}
              sx={{
                bgcolor: `${phases[phase]}.main`,
                clipPath: PHASE_CLIP_PATH,
              }}
            >
              <AppIcon icon={phases[phase]} />
              <Typography noWrap overflow="ellipsis" pl={1} fontSize="small">
                {currentPhase === `${phase}` ? t(`phases.${phases[phase]}`) : ''}
              </Typography>
            </Stack>
          </Tooltip>
        </AppLink>
      ))}
    </Stack>
  );
