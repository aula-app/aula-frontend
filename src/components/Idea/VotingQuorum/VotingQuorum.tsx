import { LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Renders "VotingQuorum" component
 * url: /
 */

interface Props {
  users: number;
  votes: number;
}

const VotingQuorum = ({ users, votes }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <LinearProgress
        variant="determinate"
        value={(votes / users) * 100}
        sx={{ bgcolor: 'voting.light', '& .MuiLinearProgress-bar': { bgcolor: 'voting.dark' } }}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="caption" color="secondary">
          {votes} {t('views.votes')}
        </Typography>
        <Typography variant="caption" color="secondary">
          {users} {t('views.users').toLowerCase()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default VotingQuorum;
