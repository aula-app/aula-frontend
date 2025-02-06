import AppIcon from '@/components/AppIcon';
import { getVote, getVoteResults } from '@/services/vote';
import { IdeaType } from '@/types/Scopes';
import { databaseRequest, Vote, votingOptions } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

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

  const fetchVote = useCallback(async () => {
    setLoading(true);
    const response = await getVote(idea.hash_id);
    if (response.error) setError(response.error);
    if (!response.error && typeof response.data === 'number') setVote(response.data);
    setLoading(false);
  }, [idea.hash_id]);

  const [numVotes, setNumVotes] = useState<Array<-1 | 0 | 1>>([0, 0, 0]);

  const getResults = () => {
    getVoteResults(idea.hash_id).then((response) => {
      if (!response.data) return;
      setNumVotes([
        response.data.votes_negative as Vote,
        response.data.votes_neutral as Vote,
        response.data.votes_positive as Vote,
      ]);
    });
  };

  useEffect(() => {
    fetchVote();
    getResults();
  }, []);

  return (
    <Stack mt={2}>
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: idea.is_winner ? 'for.main' : 'against.main',
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
            {idea.is_winner ? <AppIcon icon="for" size="xl" /> : <AppIcon icon="against" size="xl" />}
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
                direction="row"
                alignItems="center"
                fontSize="small"
                key={i}
                mr={1.5}
                sx={{ whiteSpace: 'nowrap' }}
              >
                <AppIcon icon={option} size="small" sx={{ mr: 0.5 }} /> {numVotes[i]}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default VotingResults;
