import AppIcon from '@/components/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { setWinning } from '@/services/ideas';
import { getVote, getVoteResults, ResultResponse } from '@/services/vote';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface VotingResultsProps {
  idea: IdeaType;
}

/**
 * Renders "VotingResults" component
 */
const VotingResults = ({ idea }: VotingResultsProps) => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<Vote>(0);

  const [isEditing, setEditing] = useState(false);

  const fetchVote = useCallback(async () => {
    setLoading(true);
    const response = await getVote(idea.hash_id);
    if (response.error) setError(response.error);
    if (!response.error && typeof response.data === 'number') setVote(response.data);
    setLoading(false);
  }, [idea.hash_id]);

  const [numVotes, setNumVotes] = useState<ResultResponse>({
    total_votes: 0,
    votes_negative: 0,
    votes_neutral: 0,
    votes_positive: 0,
  });

  const getResults = () => {
    getVoteResults(idea.hash_id).then((response) => {
      if (!response.data) return;
      setNumVotes(response.data);
    });
  };

  const onSubmit = async () => {
    const result = await setWinning(!idea.is_winner, idea.hash_id);
    if (!result.error) {
      setEditing(false);
      getResults();
    }
  };

  useEffect(() => {
    fetchVote();
    getResults();
  }, []);

  return (
    <Stack mt={2} position="relative">
      {checkPermissions('ideas', 'setWinner') && (
        <AppIconButton
          icon="edit"
          size="xs"
          onClick={() => setEditing(true)}
          sx={{
            position: 'absolute',
            top: 5,
            left: 40,
            bgcolor: 'background.paper',
          }}
        />
      )}
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: idea.is_winner ? 'for.main' : 'disabled.main',
        }}
        variant="outlined"
      >
        <Stack direction="row" alignItems="center">
          <Stack
            height="75px"
            alignItems="center"
            justifyContent="center"
            fontSize={40}
            sx={{
              aspectRatio: 1,
            }}
          >
            <AppIcon icon={idea.is_winner ? 'for' : 'against'} size="xl" />
          </Stack>
          <Stack flexGrow={1} pr={2}>
            <Typography variant="h6">{t(`scopes.ideas.${idea.is_winner ? 'approved' : 'rejected'}`)}</Typography>
            <Typography variant="caption">
              {t('votes.yourVote', { var: t(`votes.${votingOptions[vote + 1]}`).toLowerCase() })}
            </Typography>
          </Stack>
          <Stack>
            {votingOptions.map((option, i) => (
              <Stack
                order={-i}
                direction="row"
                alignItems="center"
                fontSize="small"
                key={i}
                mr={1.5}
                sx={{ whiteSpace: 'nowrap' }}
              >
                <AppIcon icon={option} size="small" sx={{ mr: 0.5 }} /> {Object.values(numVotes)[i + 1]}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
      {checkPermissions('ideas', 'setWinner') && (
        <Dialog open={isEditing} onClose={() => setEditing(false)}>
          <DialogTitle>{t(`results.${!idea.is_winner ? 'approveConfirm' : 'rejectConfirm'}`)}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setEditing(false)} color="secondary" autoFocus>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} variant="contained">
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
};

export default VotingResults;
