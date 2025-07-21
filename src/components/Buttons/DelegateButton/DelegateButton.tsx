import { AppIcon } from '@/components';
import DelegateVote from '@/components/DelegateVote';
import { getDelegations, getReceivedDelegations } from '@/services/users';
import { DelegationType, UserType } from '@/types/Scopes';
import { Box, Button, Stack, StackProps, Typography } from '@mui/material';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

interface Props extends StackProps {
  disabled?: boolean;
}

const DelegateButton = forwardRef<HTMLDivElement, Props>(({ disabled = false, ...restOfProps }, ref) => {
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
      {(!disabled || representing.length > 0 || delegate) && (
        <Stack
          ref={ref}
          direction="row"
          position="relative"
          justifyContent="center"
          alignItems="center"
          border={1}
          borderColor="disabled.main"
          p={1}
          borderRadius={3}
          {...restOfProps}
        >
          <Stack alignItems="end" mr={1}>
            {representing.length > 0 && (
              <Typography variant="caption" lineHeight={1}>
                <Trans i18nKey={t('delegation.represent')} />
              </Typography>
            )}
            {((disabled && delegate) || !disabled) && (
              <Box lineHeight={1}>
                <Typography variant="caption" lineHeight={1} borderRadius={1}>
                  <Trans
                    i18nKey={
                      delegate
                        ? `${t('delegation.delegated', { var: delegate.delegate_displayname })}`
                        : `${t('votes.vote').toUpperCase()} ${t('ui.common.or')}`
                    }
                  />
                </Typography>

                {!disabled && (
                  <Button
                    size="small"
                    sx={{ bgcolor: 'inherit', p: 0, m: 0, minWidth: 0, lineHeight: 1, ml: 0.5 }}
                    onClick={() => setDelegating(true)}
                    color={delegate ? 'error' : 'primary'}
                  >
                    <Typography variant="caption" lineHeight={1}>
                      {delegate ? t('delegation.revoke') : t('delegation.delegate')}
                    </Typography>
                  </Button>
                )}
              </Box>
            )}
          </Stack>
          <AppIcon icon="delegate" />
        </Stack>
      )}
      <DelegateVote
        open={delegating}
        delegate={delegate ? delegate.delegate_hash_id : undefined}
        onClose={closeDeletion}
      />
    </>
  );
});

DelegateButton.displayName = 'DelegateButton';

export default DelegateButton;
