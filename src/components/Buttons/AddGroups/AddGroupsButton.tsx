import AppIcon from '@/components/AppIcon';
import { getGroups } from '@/services/groups';
import { addUserGroup, getUserGroups, removeUserGroup } from '@/services/users';
import { GroupType } from '@/types/Scopes';
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
  users?: string[];
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddRoomRefProps {
  setNewUserGroups: (id: string) => void;
}

const AddGroupButton = forwardRef<AddRoomRefProps, Props>(({ users = [], disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [indeterminateGroups, setIndeterminateGroups] = useState<string[]>([]);
  const [updates, setUpdates] = useState<UpdtesObject>({ add: [], remove: [] });

  const fetchGroups = useCallback(async () => {
    const response = await getGroups();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setGroups(response.data);
  }, []);

  const fetchUsersGropus = async () => {
    if (users.length === 0) return;

    if (users.length === 1) {
      const boxes = await getUserGroups(users[0]);
      if (boxes.data) setSelectedGroups(boxes.data.map((box) => box.hash_id));
      return;
    }

    const groupCounts: { [key: string]: number } = {};
    const commonGroups = [] as string[];
    const partialGroups = [] as string[];

    const Promises = users.map(async (user) => {
      const groups = await getUserGroups(user);
      groups.data?.forEach((group) => {
        groupCounts[group.hash_id] = (groupCounts[group.hash_id] || 0) + 1;
      });
    });

    await Promise.all(Promises).then(() => {
      Object.keys(groupCounts).forEach((group_id) => {
        if (groupCounts[group_id] === users.length) {
          commonGroups.push(group_id);
        } else {
          partialGroups.push(group_id);
        }
      });

      setSelectedGroups(commonGroups);
      setIndeterminateGroups(partialGroups);
    });
  };

  const toggleGroup = (id: string) => {
    if (!selectedGroups.includes(id)) {
      setSelectedGroups([...selectedGroups, id]);
      addUpdate(true, id);
    } else {
      setSelectedGroups(selectedGroups.filter((group) => group !== id));
      addUpdate(false, id);
    }
  };

  const addUpdate = (add: boolean, id: string) => {
    if (add) {
      if (updates.add.includes(id)) return;
      if (updates.remove.includes(id))
        setUpdates({ add: updates.add.filter((group) => group !== id), remove: updates.remove });
      else setUpdates({ add: [...updates.add, id], remove: updates.remove });
    } else {
      if (updates.remove.includes(id)) return;
      if (updates.add.includes(id))
        setUpdates({ add: updates.add, remove: updates.remove.filter((group) => group !== id) });
      else if (indeterminateGroups.includes(id)) {
        setIndeterminateGroups(indeterminateGroups.filter((group) => group !== id));
        setUpdates({ add: updates.add, remove: [...updates.remove, id] });
      } else setUpdates({ add: updates.add, remove: [...updates.remove, id] });
    }
  };

  const setUsersGroups = async () => {
    const add = users.map((user_id) => updates.add.map((group_id) => addUserGroup(user_id, group_id)));
    const remove = users.map((user_id) => updates.remove.map((group_id) => removeUserGroup(user_id, group_id)));
    await Promise.all([...add, ...remove]);
    setUpdates({ add: [], remove: [] });
  };

  const setNewUserGroups = (user_id: string) => {
    updates.add.map((group_id) => addUserGroup(user_id, group_id));
    setUpdates({ add: [], remove: [] });
  };

  useImperativeHandle(ref, () => ({
    setNewUserGroups,
  }));

  const onSubmit = () => {
    if (users.length > 0) setUsersGroups();
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedGroups([]);
  };

  const onReset = () => {
    setUpdates({ add: [], remove: [] });
    fetchGroups();
    fetchUsersGropus();
  };

  useEffect(() => {
    if (open) onReset();
  }, [open, users]);

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
        disabled={users.length === 0}
        {...restOfProps}
      >
        <AppIcon icon="group" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.groups.name'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {t('actions.addToParent', {
            var: t('scopes.groups.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ pt: 0 }}>
          {groups.map((group) => (
            <ListItem disablePadding key={group.hash_id}>
              <ListItemButton onClick={() => toggleGroup(group.hash_id)}>
                <ListItemAvatar>
                  <Checkbox
                    checked={selectedGroups.includes(group.hash_id)}
                    indeterminate={
                      !selectedGroups.includes(group.hash_id) && indeterminateGroups.includes(group.hash_id)
                    }
                  />
                </ListItemAvatar>
                <ListItemText primary={group.group_name} />
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

export default AddGroupButton;
