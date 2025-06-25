import AppIcon from '@/components/AppIcon';
import DelegateButton from '@/components/Buttons/DelegateButton';
import { getDelegations } from '@/services/users';
import { addVote, getVote } from '@/services/vote';
import { checkPermissions, Vote, votingOptions } from '@/utils';
import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  const [hasDelegate, setHasDelegate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<Vote | null>(null);

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

  const isDelegatedVote = useCallback(async () => {
    if (!box_id) return;
    const response = await getDelegations(box_id);
    setHasDelegate(!!response.data && response.data.length > 0);
  }, []);

  const handleVoteClick = (voteValue: Vote) => {
    if (hasDelegate) {
      setPendingVote(voteValue);
      setDialogOpen(true);
    } else {
      registerVote(voteValue);
    }
  };

  const registerVote = async (vote: Vote) => {
    if (!idea_id) return;
    addVote(idea_id, vote).then(() => {
      fetchVote();
      onReload();
      setDialogOpen(false);
      setPendingVote(null);
    });
  };

  useEffect(() => {
    if (!checkPermissions('ideas', 'vote')) return;
    fetchVote();
    isDelegatedVote();
  }, []);

  return (
    <Stack>
      <Stack py={2}>
        <Stack direction="row-reverse" justifyContent="space-around">
          {votingOptions.map((option, i) => (
            <Button
              sx={{
                color: 'inherit',
                bgcolor:
                  typeof vote === 'number' &&
                  ((vote < 0 && i === 0) || (vote === 0 && i === 1) || (vote > 0 && i === 2))
                    ? `${option}.main`
                    : 'transparent',
                borderRadius: 8,
                '&:hover': {
                  bgcolor: `${option}.main`,
                },
              }}
              data-testid={option}
              disabled={!checkPermissions('ideas', 'vote') || isLoading}
              key={i}
              onClick={() => handleVoteClick((i - 1) as Vote)}
            >
              <Stack alignItems="center" width={70}>
                <AppIcon icon={option} size="xxl" />
                {t(`votes.${option}`)}
              </Stack>
            </Button>
          ))}
        </Stack>
      </Stack>
      <DelegateButton disabled />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('votes.delegatedVoteWarning.title')}</DialogTitle>
        <DialogContent>{t('votes.delegatedVoteWarning.message')}</DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setDialogOpen(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained" onClick={() => pendingVote !== null && registerVote(pendingVote)} autoFocus>
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default VotingCard;
