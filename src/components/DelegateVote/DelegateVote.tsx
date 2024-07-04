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
import { AppIcon, AppIconButton } from '@/components';
import { ChangeEvent, useEffect, useState } from 'react';
import { UserType, UsersResponseType } from '@/types/scopes/UserTypes';
import { databaseRequest } from '@/utils';
import { grey } from '@mui/material/colors';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = ({ isOpen, onClose }: Props) => {
  const [users, setUsers] = useState<UserType[]>();
  const [selected, setSelected] = useState<UserType | null>();
  const [filter, setFilter] = useState('');
  const [confirm, setConfirm] = useState(false);

  const dataFetch = async () => {
    await databaseRequest('model', {
      model: 'User',
      method: 'getUsers',
      arguments: {
        offset: 0,
        limit: 0,
        orderby: 1,
        asc: 1,
        extra_where: ` AND (realname LIKE '%${filter}%' OR displayname LIKE '%${filter}%')`,
      },
    }).then((response: UsersResponseType) => setUsers(response.data));
  };

  const select = (user: UserType) => {
    setSelected(selected !== null ? user : null);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const close = () => {
    onClose();
    setConfirm(false);
  };

  const delegate = () => {
    confirm ? null : setConfirm(true);
  };

  useEffect(() => {
    dataFetch();
  }, [filter]);

  return (
    <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>Vote delegation</DialogTitle>
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
                      <Avatar>
                        <AppIcon icon="avatar" />
                      </Avatar>
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
              <Typography>Are you sure you want to delegate your voting rights on this box?</Typography>
              {selected && (
                <Stack flex={1} alignItems="center" justifyContent="center">
                  <Avatar sx={{ width: 56, height: 56, mb: 1 }}>
                    <AppIcon icon="avatar" size="xl" />
                  </Avatar>
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
        <Button color="secondary" onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" onClick={delegate} disabled={!selected}>
          {confirm ? 'Delegate' : 'Select'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DelegateVote;
