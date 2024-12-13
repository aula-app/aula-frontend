import { RoomPhases } from '@/types/SettingsTypes';
import { databaseRequest, phases } from '@/utils';
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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
  const [quorum, setQuorum] = useState<number>(0);

  async function getQuorum() {
    await databaseRequest({
      model: 'Settings',
      method: 'getQuorum',
      arguments: {},
    }).then((response) => {
      if (!response.success || !response.data) return;
      setQuorum(phase >= 30 ? Number(response.data.quorum_votes) : Number(response.data.quorum_wild_ideas));
    });
  }

  useEffect(() => {
    getQuorum();
  }, []);

  return (
    <Stack>
      <Stack sx={{ position: 'relative' }}>
        <Tooltip title={`${Math.round(quorum)}%`} open={true} placement="bottom" arrow={true}>
          <Box sx={{ position: 'absolute', left: `${Math.round(quorum)}%` }} />
        </Tooltip>
        <LinearProgress
          variant="determinate"
          value={(votes / users) * 100}
          sx={{ bgcolor: `${phases[phase]}.light`, '& .MuiLinearProgress-bar': { bgcolor: `${phases[phase]}.dark` } }}
        />
      </Stack>
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
