import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Renders "VotingQuorum" component
 * url: /
 */

interface Props {
  phase: RoomPhases;
  users: number;
  votes: number;
  quorum: number;
}

const VotingQuorum: React.FC<Props> = ({ phase, users, votes, quorum }) => {
  const { t } = useTranslation();

  return (
    <Stack pt={2}>
      <Stack sx={{ position: 'relative' }}>
        {quorum > 0 && (
          <Tooltip title={`${Math.round(quorum)}%`} open={true} placement="bottom" arrow={true}>
            <Box sx={{ position: 'absolute', left: `${Math.round(quorum)}%` }} />
          </Tooltip>
        )}
        <LinearProgress
          variant="determinate"
          value={(votes / users) * 100}
          sx={{ bgcolor: `${phases[phase]}.light`, '& .MuiLinearProgress-bar': { bgcolor: `${phases[phase]}.dark` } }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="caption">
          <span data-testing-id="total-votes">{votes}</span> {t(`ui.units.${phase >= 30 ? 'votes' : 'likes'}`)}
        </Typography>
        <Typography variant="caption">
          {users} {t('scopes.users.plural')}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default VotingQuorum;
