import AppIcon from '@/components/AppIcon';
import { getUsers } from '@/services/users';
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
  setNewUserUsers: (id: string) => void;
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
    if (users.length === 0) return;

    if (users.length === 1) {
      const users = await getUserUsers(users[0]);
      if (users.data) setSelectedUsers(users.data.map((user) => user.hash_id));
      return;
    }

    const userCounts: { [key: string]: number } = {};
    const commonUsers = [] as string[];
    const partialUsers = [] as string[];

    const Promises = users.map(async (user) => {
      const users = await getUserUsers(user);
      users.data?.forEach((user) => {
        userCounts[user.hash_id] = (userCounts[user.hash_id] || 0) + 1;
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
    const add = users.map((user_id) => updates.add.map((user_id) => addUserUser(user_id, user_id)));
    const remove = users.map((user_id) => updates.remove.map((user_id) => removeUserUser(user_id, user_id)));
    await Promise.all([...add, ...remove]);
    setUpdates({ add: [], remove: [] });
  };

  const setNewUserUsers = (user_id: string) => {
    updates.add.map((user_id) => addUserUser(user_id, user_id));
    setUpdates({ add: [], remove: [] });
  };

  useImperativeHandle(ref, () => ({
    setNewUserUsers,
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
        <AppIcon icon="user" pr={2} />
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
                <ListItemText primary={user.user_name} />
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
