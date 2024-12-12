import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Renders "VotingQuorum" component
 * url: /
 */

interface Props {
  phase: RoomPhases;
  users: number;
  votes: number;
}

const VotingQuorum = ({ phase, users, votes }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <LinearProgress
        variant="determinate"
        value={(votes / users) * 100}
        sx={{ bgcolor: `${phases[phase]}.light`, '& .MuiLinearProgress-bar': { bgcolor: `${phases[phase]}.dark` } }}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="caption" color="secondary">
          {votes} {t(`views.${phase >= 30 ? 'votes' : 'likes'}`)}
        </Typography>
        <Typography variant="caption" color="secondary">
          {users} {t('views.users').toLowerCase()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default VotingQuorum;
