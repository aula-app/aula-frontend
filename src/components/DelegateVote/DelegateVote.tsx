import { AppIcon, AppIconButton } from '@/components';
import { DelegationType } from '@/types/Delegation';
import { UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import {
  Avatar,
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
  isOpen: boolean;
  onClose: () => void;
  delegate: DelegationType[];
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = ({ isOpen, delegate, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [users, setUsers] = useState<UserType[]>();
  const [selected, setSelected] = useState<UserType | null>();
  const [filter, setFilter] = useState('');
  const [confirm, setConfirm] = useState(delegate.length > 0);

  const usersFetch = async () => {
    await databaseRequest({
      model: 'User',
      method: 'getUsers',
      arguments: {
        offset: 0,
        limit: 0,
        orderby: 1,
        asc: 1,
        extra_where: ` AND (realname LIKE '%${filter}%' OR displayname LIKE '%${filter}%')`,
      },
    }).then((response) => setUsers(response.data));
  };

  const singleUserFetch = async () => {
    if (delegate.length === 0) return;
    await databaseRequest({
      model: 'User',
      method: 'getUserBaseData',
      arguments: {
        user_id: delegate[0].user_id_target,
      },
    }).then((response) => setSelected(response.data));
  };

  const setDelegate = async () => {
    if (!selected || !params.box_id) return;
    await databaseRequest(
      {
        model: 'User',
        method: 'delegateVoteRight',
        arguments: {
          user_id_target: selected.id,
          topic_id: params.box_id,
        },
      },
      ['user_id', 'updater_id']
    ).then(() => onClose());
  };

  const removeDelegate = async () => {
    if (!selected || !params.box_id) return;
    await databaseRequest(
      {
        model: 'User',
        method: 'giveBackAllDelegations',
        arguments: {
          topic_id: params.box_id,
        },
      },
      ['user_id']
    ).then(() => onClose());
  };

  const select = (user: UserType) => {
    setSelected(selected !== null ? user : null);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    delegate.length === 0 ? usersFetch() : singleUserFetch();
  }, [filter, delegate.length]);

  useEffect(() => {
    setConfirm(delegate.length > 0);
  }, [delegate.length]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('texts.delegation')}</DialogTitle>
      <DialogContent>
        <Stack height={350} position="relative" overflow="hidden">
          <Slide direction="right" in={!confirm} mountOnEnter unmountOnExit>
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
                {users &&
                  users.map((user) => (
                    <Stack
                      component={Button}
                      direction="row"
                      mt={1}
                      key={user.id}
                      bgcolor={selected && selected.id === user.id ? grey[200] : 'transparent'}
                      borderRadius={30}
                      sx={{
                        textTransform: 'none',
                        textAlign: 'left',
                        justifyContent: 'start',
                        color: 'inherit',
                      }}
                      onClick={() => select(user)}
                    >
                      <UserAvatar id={user.id} update={true}/>
                      <Stack ml={2}>
                        <Typography>{user.realname}</Typography>
                        <Typography color="secondary" fontSize="small">
                          {user.displayname}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          </Slide>
          <Slide direction="left" in={confirm} mountOnEnter unmountOnExit>
            <Stack height="100%" width="100%">
              <Typography>
                {t('delegation.confirm', {
                  var: t(delegate.length === 0 ? 'delegation.delegate' : 'delegation.revoke'),
                })}
              </Typography>
              {selected && (
                <Stack flex={1} alignItems="center" justifyContent="center">
                  <UserAvatar id={selected.id} update={true} size="large" />
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
        <Button color="secondary" onClick={onClose}>
          {t('defaults.cancel')}
        </Button>
        {!confirm ? (
          <Button variant="contained" onClick={() => setConfirm(true)} disabled={!selected}>
            {t('delegation.select')}
          </Button>
        ) : delegate.length === 0 ? (
          <Button variant="contained" onClick={setDelegate}>
            {t('delegation.delegate')}
          </Button>
        ) : (
          <Button variant="contained" onClick={removeDelegate}>
            {t('delegation.revoke')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DelegateVote;
