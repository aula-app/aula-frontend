import AppIcon from '@/components/AppIcon';
import { databaseRequest, Vote, votingOptions } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface VotingResultsProps {
  rejected?: boolean;
  yourVote: Vote;
}

/**
 * Renders "VotingResults" component
 */
const VotingResults = ({ rejected = false, yourVote }: VotingResultsProps) => {
  const { t } = useTranslation();
  const params = useParams();
  const [numVotes, setNumVotes] = useState<Array<-1 | 0 | 1>>([0, 0, 0]);

  const getResults = async () => {
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaVoteStats',
      arguments: {
        idea_id: params['idea_id'],
      },
    }).then((response) => {
      if (response.data)
        setNumVotes([response.data.votes_negative, response.data.votes_neutral, response.data.votes_positive]);
    });
  };

  useEffect(() => {
    getResults();
  }, []);

  return (
    <Stack mb={2}>
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: rejected ? 'against.main' : 'for.main',
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
            {!rejected ? <AppIcon icon="for" size="xl" /> : <AppIcon icon="against" size="xl" />}
          </Stack>
          <Stack flexGrow={1} pr={2}>
            <Typography variant="body2">{t(`texts.${rejected ? 'rejected' : 'approved'}`)}</Typography>
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
      <Stack direction="row" alignItems="center" mx={3} mt={1} fontSize="small">
        <AppIcon icon={votingOptions[yourVote + 1]} />
        &nbsp; {t('texts.yourVote', { var: t(`votes.${votingOptions[yourVote + 1]}`) })}
      </Stack>
    </Stack>
  );
};

export default VotingResults;
