import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  Stack,
  Typography,
} from '@mui/material';
import { AppIcon, AppIconButton } from '@/components';
import { ChangeEvent, useEffect, useState } from 'react';
import { UserType, UsersResponseType } from '@/types/scopes/UserTypes';
import { databaseRequest } from '@/utils';
import { grey } from '@mui/material/colors';
import { useAppStore } from '@/store';

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = () => {
  const [state, dispatch] = useAppStore();
  const [users, setUsers] = useState<UserType[]>();
  const [selected, setSelected] = useState<number | null>();
  const [filter, setFilter] = useState('');

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

  const select = (id: number) => {
    setSelected(selected === id ? null : id)
  }

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    dataFetch();
  }, [filter]);

  return (
    <Dialog open={state.delegateVote !== null} onClose={() => null}>
      <DialogTitle>Vote delegation</DialogTitle>
      <DialogContent>
        <FilledInput
          size="small"
          onChange={changeSearch}
          value={filter}
          startAdornment={<AppIcon icon="search" size="small" sx={{ mr: 1 }} />}
          endAdornment={<AppIconButton icon="close" size="small" onClick={() => setFilter('')} />}
        />
        <Stack my={1} height={325} overflow="auto">
          {users &&
            users.map((user) => (
              <Stack
                component={Button}
                direction="row"
                mt={1}
                key={user.id}
                bgcolor={selected === user.id ? grey[200] : 'transparent'}
                borderRadius={30}
                sx={{
                  textTransform: 'none',
                  textAlign: 'left',
                  justifyContent: 'start',
                  color: 'inherit'
                }}
                onClick={() => select(Number(user.id))}
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button color="secondary" onClick={() => dispatch({type: 'DELEGATE', payload: null})}>Cancel</Button>
        <Button variant="contained">Delegate</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DelegateVote;
