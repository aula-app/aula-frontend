import { AppIcon } from '@/components';
import DelegateVote from '@/components/DelegateVote';
import KnowMore from '@/components/KnowMore';
import { getDelegations, getReceivedDelegations } from '@/services/users';
import { DelegationType, UserType } from '@/types/Scopes';
import { Box, BoxProps, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateButton: React.FC<BoxProps> = ({ ...restOfProps }) => {
  const { t } = useTranslation();
  const { box_id } = useParams();

  /**
   * Delegation data
   */

  const [delegate, setDelegate] = useState<DelegationType>();
  const [delegating, setDelegating] = useState(false);
  const [representing, setRepresenting] = useState<UserType[]>([]);

  const fetchDelegation = useCallback(async () => {
    if (!box_id) return;

    const response = await getDelegations(box_id);
    if (!response.error && response.data) setDelegate(response.data[0]);
  }, [box_id]);

  const fetchRepresented = useCallback(async () => {
    if (!box_id) return;

    const response = await getReceivedDelegations(box_id);
    if (!response.error && response.data) setRepresenting(response.data);
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
    <>
      <KnowMore title={t('tooltips.delegate')} {...restOfProps}>
        <Stack
          direction="row"
          position="relative"
          justifyContent="center"
          border={1}
          borderColor="disabled.main"
          p={1}
          pb={0}
          borderRadius={3}
        >
          <Stack alignItems="end" mr={1}>
            {representing.length > 0 && (
              <Typography variant="caption" lineHeight={1}>
                <Trans i18nKey={t('delegation.represent', { var: representing.length })} />
              </Typography>
            )}
            <Box>
              <Typography variant="caption" lineHeight={1} borderRadius={1}>
                <Trans
                  i18nKey={
                    delegate
                      ? t('delegation.delegated', { var: delegate.delegate_displayname })
                      : t('votes.vote').toUpperCase()
                  }
                />
                {` ${t('ui.common.or')} `}
              </Typography>
              <Button
                size="small"
                sx={{ bgcolor: 'inherit', p: 0 }}
                onClick={() => setDelegating(true)}
                color={delegate ? 'error' : 'primary'}
              >
                {delegate ? t('delegation.revoke') : t('delegation.delegate')}
              </Button>
            </Box>
          </Stack>
          <AppIcon icon="delegate" />
        </Stack>
      </KnowMore>
      <DelegateVote
        open={delegating}
        delegate={delegate ? delegate.user_id_target : undefined}
        onClose={closeDeletion}
      />
    </>
  );
};

export default DelegateButton;
