import AppIcon from '@/components/AppIcon';
import { getQuorum, getVote, getVoteResults, ResultResponse, setToLosing, setToWinning } from '@/services/vote';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import { Card, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  idea: IdeaType;
  quorum: number;
  onReload: () => void;
}

/**
 * Renders "VotingResults" component
 */
const VotingResults: React.FC<Props> = ({ idea, quorum, onReload }) => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<Vote | null>();

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

  const handleSetWinner = async (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const response = checked ? await setToWinning(idea.hash_id) : await setToLosing(idea.hash_id);
    if (!response.error) onReload();
  };

  const quorumPassed = () =>
    quorum / 100 <= (numVotes.votes_positive + numVotes.votes_negative + numVotes.votes_neutral) / numVotes.total_votes;

  useEffect(() => {
    if (checkPermissions('ideas', 'vote')) fetchVote();
    getResults();
  }, []);

  return (
    <Stack>
      {checkPermissions('ideas', 'setWinner') && (
        <FormControlLabel
          control={<Switch onChange={handleSetWinner} checked={Boolean(idea.is_winner)} />}
          label={t('settings.columns.is_winner')}
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
            <AppIcon icon={idea.is_winner ? 'winner' : quorumPassed() ? 'for' : 'against'} size="xl" />
          </Stack>
          <Stack flexGrow={1} pr={2}>
            <Typography variant="h6">
              {idea.is_winner === 1
                ? t(`scopes.ideas.winner`)
                : quorumPassed()
                  ? t(`scopes.ideas.approved`)
                  : t(`scopes.ideas.rejected`)}
            </Typography>
            {checkPermissions('ideas', 'vote') && !!vote && (
              <Typography variant="caption">
                {t('votes.yourVote', { var: t(`votes.${votingOptions[vote + 1]}`).toLowerCase() })}
              </Typography>
            )}
          </Stack>
          <Stack direction="column-reverse">
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
    </Stack>
  );
};

export default VotingResults;
