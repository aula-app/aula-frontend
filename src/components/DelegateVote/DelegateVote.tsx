import { AppIcon, AppIconButton } from '@/components';
import { DelegateType, delegateVote, getPossibleDelegations, revokeDelegation } from '@/services/users';
import { useAppStore } from '@/store';
import { GenericListRequest, localStorageGet, parseJwt } from '@/utils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UserAvatar from '../UserAvatar';

interface Props {
  open: boolean;
  onClose: () => void;
  delegate?: string;
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = ({ open, delegate, onClose }: Props) => {
  const { t } = useTranslation();
  const { room_id, box_id } = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [, dispatch] = useAppStore();

  const [users, setUsers] = useState<DelegateType[]>([]);
  const [selected, setSelected] = useState<DelegateType>();
  const [filter, setFilter] = useState('');

  const usersFetch = async () => {
    if (!box_id || !room_id) return;

    const requestData = {
      offset: 0,
      limit: 0,
      orderby: 1,
      asc: 1,
    } as GenericListRequest;

    if (filter !== '') {
      requestData['both_names'] = filter;
    }

    const response = await getPossibleDelegations({
      room_id,
      topic_id: box_id,
    });

    if (response.error || !response.data) return;
    setUsers(response.data.filter((user) => user.hash_id !== jwt_payload?.user_hash)); // remove self from list
    if (delegate) setSelected(response.data.find((user) => user.hash_id === delegate));
  };

  const setDelegate = async () => {
    if (!selected || !box_id) return;
    const response = await delegateVote(selected.hash_id, box_id);

    if (response.error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
    }

    dispatch({ type: 'ADD_POPUP', message: { message: t('delegation.status.success'), type: 'success' } });
    handleClose();
  };

  const removeDelegate = async () => {
    if (!box_id) return;
    const response = await revokeDelegation(box_id);

    if (response.error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
    }

    dispatch({ type: 'ADD_POPUP', message: { message: t('delegation.status.revoked'), type: 'success' } });
    handleClose();
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const onReset = () => {
    setFilter('');
    setSelected(undefined);
  };

  const handleClose = () => {
    onReset();
    onClose();
  };

  useEffect(() => {
    usersFetch();
  }, [delegate, filter]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('delegation.label')}</DialogTitle>
      <DialogContent>
        <Stack height={350} position="relative" overflow="hidden">
          <Slide direction="right" in={!selected && !delegate} mountOnEnter unmountOnExit>
            <Stack position="absolute" height="100%" width="100%">
              <FilledInput
                size="small"
                onChange={changeSearch}
                value={filter}
                fullWidth
                startAdornment={<AppIcon icon="search" size="small" sx={{ mr: 1 }} />}
                endAdornment={<AppIconButton icon="close" size="small" onClick={() => setFilter('')} />}
              />
              <Stack my={1} overflow="auto">
                {users.length > 0 &&
                  users.map((user) => (
                    <Stack
                      component={Button}
                      direction="row"
                      mt={1}
                      key={user.hash_id}
                      bgcolor={
                        Boolean(user.is_delegate)
                          ? grey[100]
                          : selected && selected.hash_id === user.hash_id
                            ? grey[200]
                            : 'transparent'
                      }
                      borderRadius={30}
                      disabled={Boolean(user.is_delegate)}
                      sx={{
                        textTransform: 'none',
                        textAlign: 'left',
                        justifyContent: 'start',
                        color: 'inherit',
                      }}
                      onClick={() => setSelected(user)}
                    >
                      <UserAvatar id={user.hash_id} />
                      <Stack ml={2}>
                        <Typography color={Boolean(user.is_delegate) ? 'secondary' : ''}>{user.realname}</Typography>
                        {Boolean(user.is_delegate) ? (
                          <Typography color="secondary" fontSize="small">
                            {t('delegation.already')}
                          </Typography>
                        ) : (
                          <Typography color="secondary" fontSize="small">
                            {user.displayname}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          </Slide>
          <Slide direction="left" in={!!selected || !!delegate} mountOnEnter unmountOnExit>
            <Stack height="100%" width="100%">
              <Typography>
                {t('delegation.confirm', {
                  var: t(!delegate ? 'delegation.delegate' : 'delegation.revoke'),
                })}
              </Typography>
              {selected && (
                <Stack flex={1} alignItems="center" justifyContent="center">
                  <UserAvatar id={selected.hash_id} size={150} />
                  <Typography>{selected.realname}</Typography>
                  <Typography color="secondary" fontSize="small">
                    {selected.displayname}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Slide>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button color="secondary" onClick={handleClose}>
          {t('actions.cancel')}
        </Button>
        {selected && (
          <>
            {!delegate ? (
              <Button variant="contained" onClick={setDelegate}>
                {t('delegation.delegate')}
              </Button>
            ) : (
              <Button variant="contained" onClick={removeDelegate}>
                {t('delegation.revoke')}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DelegateVote;
