import { AppIcon } from '@/components';
import DelegateVote from '@/components/DelegateVote';
import KnowMore from '@/components/KnowMore';
import { getDelegations, getReceivedDelegations } from '@/services/users';
import { DelegationType } from '@/types/Scopes';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateButton: React.FC = () => {
  const { t } = useTranslation();
  const { box_id } = useParams();

  /**
   * Delegation data
   */

  const [delegate, setDelegate] = useState<DelegationType>();
  const [delegating, setDelegating] = useState(false);
  const [represented, setRepresented] = useState(0);

  const fetchDelegation = useCallback(async () => {
    if (!box_id) return;

    const response = await getDelegations(box_id);
    if (!response.error && response.data) setDelegate(response.data[0]);
  }, [box_id]);

  const fetchRepresented = useCallback(async () => {
    if (!box_id) return;

    const response = await getReceivedDelegations(box_id);
    if (!response.error && response.data) console.log(response.data);
  }, [box_id]);

  const closeDeletion = () => {
    fetchDelegation();
    setDelegating(false);
  };

  useEffect(() => {
    fetchDelegation();
    fetchRepresented();
  }, [fetchDelegation, fetchRepresented]);

  return (
    <Stack direction="row" position="relative" alignItems="center" sx={{ ml: 'auto', pr: 3 }}>
      <Stack>
        <Box>
          <Typography variant="caption">
            <Trans
              i18nKey={
                delegate
                  ? t('delegation.delegated', { var: delegate.delegate_displayname })
                  : t('votes.vote').toUpperCase()
              }
            />{' '}
            {t('ui.common.or')}
          </Typography>
          <Button size="small" sx={{ bgcolor: '#fff' }} onClick={() => setDelegating(true)}>
            {delegate ? t('delegation.revoke') : t('delegation.delegate')}
          </Button>
        </Box>
      </Stack>
      <KnowMore title={t('tooltips.delegate')}>
        <AppIcon icon="delegate" size="small" />
      </KnowMore>
      <DelegateVote
        open={delegating}
        delegate={delegate ? delegate.user_id_target : undefined}
        onClose={closeDeletion}
      />
    </Stack>
  );
};

export default DelegateButton;
