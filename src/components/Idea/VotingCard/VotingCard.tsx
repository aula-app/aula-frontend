import AppIcon from '@/components/AppIcon';
import { addVote, getVote } from '@/services/vote';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import { Button, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  onReload: () => void;
}

/**
 * Renders "VotingCards" component
 * url: /
 */
const VotingCard = ({ onReload }: Props) => {
  const { idea_id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<Vote>();

  const fetchVote = useCallback(async () => {
    if (!idea_id) return;
    setLoading(true);
    const response = await getVote(idea_id);
    if (response.error) setError(response.error);
    if (!response.error) setVote(response.data || 0);
    setLoading(false);
  }, [idea_id]);

  const registerVote = async (vote: Vote) => {
    if (!idea_id) return;
    addVote(idea_id, vote).then(() => {
      fetchVote();
      onReload();
    });
  };

  useEffect(() => {
    if (checkPermissions('ideas', 'vote'))
      fetchVote();
  }, []);

  return (
    <Stack p={2}>
      <Stack direction="row-reverse" justifyContent="space-around">
        {votingOptions.map((option, i) => (
          <Button
            sx={{
              color: 'inherit',
              bgcolor: typeof vote === 'number' && vote + 1 === i ? `${option}.main` : 'transparent',
              borderRadius: 8,
              '&:hover': {
                bgcolor: `${option}.main`,
              },
            }}
            disabled={!checkPermissions('ideas', 'vote') || isLoading}
            key={i}
            onClick={() => registerVote((i - 1) as Vote)}
          >
            <Stack alignItems="center" width={70}>
              <AppIcon icon={option} size="xxl" />
              {option}
            </Stack>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default VotingCard;
