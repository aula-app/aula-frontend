import AppIcon from '@/components/AppIcon';
import { getRoomUsers } from '@/services/rooms';
import { addUserRoom, getUsers, removeUserRoom } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { UpdtesObject } from '@/types/SettingsTypes';
import {
  Button,
  ButtonProps,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  rooms?: string[];
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddUserRefProps {
  setNewUserRooms: (id: string) => void;
}

const AddUserButton = forwardRef<AddUserRefProps, Props>(({ rooms = [], disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [indeterminateUsers, setIndeterminateUsers] = useState<string[]>([]);
  const [updates, setUpdates] = useState<UpdtesObject>({ add: [], remove: [] });

  const fetchUsers = useCallback(async () => {
    const response = await getUsers({
      offset: 0,
      limit: 0,
    });
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUsers(response.data);
  }, []);

  const fetchUsersUsers = async () => {
    if (rooms.length === 0) return;

    if (rooms.length === 1) {
      const users = await getRoomUsers(rooms[0]);
      if (users.data) setSelectedUsers(users.data.map((user) => user.hash_id));
      return;
    }

    const userCounts: { [key: string]: number } = {};
    const commonUsers = [] as string[];
    const partialUsers = [] as string[];

    const Promises = rooms.map(async (room) => {
      const rooms = await getRoomUsers(room);
      rooms.data?.forEach((room) => {
        userCounts[room.hash_id] = (userCounts[room.hash_id] || 0) + 1;
      });
    });

    await Promise.all(Promises).then(() => {
      Object.keys(userCounts).forEach((user_id) => {
        if (userCounts[user_id] === users.length) {
          commonUsers.push(user_id);
        } else {
          partialUsers.push(user_id);
        }
      });

      setSelectedUsers(commonUsers);
      setIndeterminateUsers(partialUsers);
    });
  };

  const toggleUser = (id: string) => {
    if (!selectedUsers.includes(id)) {
      // add
      setSelectedUsers([...selectedUsers, id]);
      addUpdate(true, id);
    } else {
      // remove
      setSelectedUsers(selectedUsers.filter((user) => user !== id));
      addUpdate(false, id);
    }
  };

  const addUpdate = (add: boolean, id: string) => {
    if (add) {
      if (updates.add.includes(id)) return;
      if (updates.remove.includes(id))
        setUpdates({ add: updates.add.filter((user) => user !== id), remove: updates.remove });
      else setUpdates({ add: [...updates.add, id], remove: updates.remove });
    } else {
      if (updates.remove.includes(id)) return;
      if (updates.add.includes(id))
        setUpdates({ add: updates.add, remove: updates.remove.filter((user) => user !== id) });
      else if (indeterminateUsers.includes(id)) {
        setIndeterminateUsers(indeterminateUsers.filter((user) => user !== id));
        setUpdates({ add: updates.add, remove: [...updates.remove, id] });
      } else setUpdates({ add: updates.add, remove: [...updates.remove, id] });
    }
  };

  const setUsersUsers = async () => {
    const add = users.map((user) => updates.add.map((room_id) => addUserRoom(user.hash_id, room_id)));
    const remove = users.map((user) => updates.remove.map((room_id) => removeUserRoom(user.hash_id, room_id)));
    await Promise.all([...add, ...remove]);
    setUpdates({ add: [], remove: [] });
  };

  const setNewUserRooms = (user_id: string) => {
    updates.add.map((room_id) => addUserRoom(user_id, room_id));
    setUpdates({ add: [], remove: [] });
  };

  useImperativeHandle(ref, () => ({
    setNewUserRooms,
  }));

  const onSubmit = () => {
    if (users.length > 0) setUsersUsers();
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedUsers([]);
  };

  const onReset = () => {
    setUpdates({ add: [], remove: [] });
    fetchUsers();
    fetchUsersUsers();
  };

  useEffect(() => {
    if (open) onReset();
  }, [users, open]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} disabled={disabled} {...restOfProps}>
        <AppIcon icon="users" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.users.name'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {t('actions.addToParent', {
            var: t('scopes.users.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ pt: 0 }}>
          {users.map((user) => (
            <ListItem disablePadding key={user.hash_id}>
              <ListItemButton onClick={() => toggleUser(user.hash_id)}>
                <ListItemAvatar>
                  <Checkbox
                    checked={selectedUsers.includes(user.hash_id)}
                    indeterminate={!selectedUsers.includes(user.hash_id) && indeterminateUsers.includes(user.hash_id)}
                  />
                </ListItemAvatar>
                <ListItemText primary={user.displayname} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default AddUserButton;
