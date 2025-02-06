import AppIcon from '@/components/AppIcon';
import { getRooms } from '@/services/rooms';
import { addUserRoom, getUserRooms, removeUserRoom } from '@/services/users';
import { RoomType } from '@/types/Scopes';
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
  setNewUserRooms: (id: string) => void;
}

const AddRoomButton = forwardRef<AddRoomRefProps, Props>(({ users = [], disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [indeterminateRooms, setIndeterminateRooms] = useState<string[]>([]);
  const [updates, setUpdates] = useState<UpdtesObject>({ add: [], remove: [] });

  const fetchRooms = useCallback(async () => {
    const response = await getRooms();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setRooms(response.data);
  }, []);

  const fetchUsersRooms = async () => {
    if (users.length === 0) return;

    const roomCounts: { [key: string]: number } = {};
    const commonRooms = [] as string[];
    const partialRooms = [] as string[];

    const roomPromises = users.map(async (user) => {
      const rooms = await getUserRooms(user);
      if (users.length === 1) {
        if (rooms.data) setSelectedRooms(rooms.data.map((room) => room.hash_id));
      } else {
        rooms.data?.forEach((room) => {
          roomCounts[room.hash_id] = (roomCounts[room.hash_id] || 0) + 1;
        });
      }
    });

    await Promise.all(roomPromises).then(() => {
      Object.keys(roomCounts).forEach((room_id) => {
        if (roomCounts[room_id] === users.length) {
          commonRooms.push(room_id);
        } else {
          partialRooms.push(room_id);
        }
      });

      setSelectedRooms(commonRooms);
      setIndeterminateRooms(partialRooms);
    });
  };

  const toggleRoom = (id: string) => {
    if (!selectedRooms.includes(id)) {
      // add
      setSelectedRooms([...selectedRooms, id]);
      addUpdate(true, id);
    } else {
      // remove
      setSelectedRooms(selectedRooms.filter((room) => room !== id));
      addUpdate(false, id);
    }
  };

  const addUpdate = (add: boolean, id: string) => {
    if (add) {
      if (updates.add.includes(id)) return;
      if (updates.remove.includes(id))
        setUpdates({ add: updates.add.filter((room) => room !== id), remove: updates.remove });
      else setUpdates({ add: [...updates.add, id], remove: updates.remove });
    } else {
      if (updates.remove.includes(id)) return;
      if (updates.add.includes(id))
        setUpdates({ add: updates.add, remove: updates.remove.filter((room) => room !== id) });
      if (indeterminateRooms.includes(id)) {
        setIndeterminateRooms(indeterminateRooms.filter((room) => room !== id));
        setUpdates({ add: updates.add, remove: [...updates.remove, id] });
      } else setUpdates({ add: updates.add, remove: [...updates.remove, id] });
    }
  };

  const setUsersRooms = async () => {
    const add = users.map((user_id) => updates.add.map((room_id) => addUserRoom(user_id, room_id)));
    const remove = users.map((user_id) => updates.remove.map((room_id) => removeUserRoom(user_id, room_id)));
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
    if (users.length > 0) setUsersRooms();
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRooms([]);
  };

  const onReset = () => {
    setUpdates({ add: [], remove: [] });
    fetchRooms();
    fetchUsersRooms();
  };

  useEffect(() => {
    onReset();
  }, [users]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} disabled={disabled} {...restOfProps}>
        <AppIcon icon="room" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.rooms.name'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {t('actions.addToParent', {
            var: t('scopes.rooms.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ pt: 0 }}>
          {rooms.map((room) => (
            <ListItem disablePadding key={room.hash_id}>
              <ListItemButton onClick={() => toggleRoom(room.hash_id)}>
                <ListItemAvatar>
                  <Checkbox
                    checked={selectedRooms.includes(room.hash_id)}
                    indeterminate={!selectedRooms.includes(room.hash_id) && indeterminateRooms.includes(room.hash_id)}
                  />
                </ListItemAvatar>
                <ListItemText primary={room.room_name} />
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

export default AddRoomButton;
