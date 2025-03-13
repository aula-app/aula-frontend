import AppIcon from '@/components/AppIcon';
import DelegateButton from '@/components/Buttons/DelegateButton';
import { addVote, getVote } from '@/services/vote';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import { Button, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Props {
  onReload: () => void;
}

/**
 * Renders "VotingCards" component
 * url: /
 */
const VotingCard = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const { idea_id, box_id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<Vote>();

  const fetchVote = useCallback(async () => {
    if (!idea_id) return;

    setLoading(true);
    const response = await getVote(idea_id);
    setLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    setVote(response.data as Vote);
  }, [idea_id]);

  const registerVote = async (vote: Vote) => {
    if (!idea_id) return;
    addVote(idea_id, vote).then(() => {
      fetchVote();
      onReload();
    });
  };

  useEffect(() => {
    if (!checkPermissions('ideas', 'vote')) return;
    fetchVote();
  }, []);

  return (
    <Stack>
      <Stack py={2}>
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
                {t(`votes.${option}`)}
              </Stack>
            </Button>
          ))}
        </Stack>
      </Stack>
      <DelegateButton />
    </Stack>
  );
};

export default VotingCard;
