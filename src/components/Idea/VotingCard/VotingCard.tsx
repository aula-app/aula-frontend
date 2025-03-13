import AppIcon from '@/components/AppIcon';
import { getDelegations } from '@/services/users';
import { addVote, getVote } from '@/services/vote';
import { DelegationType } from '@/types/Scopes';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import { Button, Chip, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
      fetchDelegation();
      onReload();
    });
  };

  /**
   * Delegation data
   */

  const [delegate, setDelegate] = useState<DelegationType>();

  const fetchDelegation = useCallback(async () => {
    if (!box_id) return;

    const response = await getDelegations(box_id);
    !response.error && response.data ? setDelegate(response.data[0]) : setDelegate(undefined);
  }, [box_id]);

  useEffect(() => {
    if (!checkPermissions('ideas', 'vote')) return;
    fetchVote();
    fetchDelegation();
  }, []);

  return (
    <Stack pb={2}>
      <Stack direction="row" alignItems="center" justifyContent="end">
        {delegate && (
          <Chip
            label={
              <Trans
                i18nKey={
                  delegate
                    ? t('delegation.delegated', { var: delegate.delegate_displayname })
                    : t('votes.vote').toUpperCase()
                }
              />
            }
            color="warning"
          />
        )}
        &nbsp;
      </Stack>
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
  );
};

export default VotingCard;
