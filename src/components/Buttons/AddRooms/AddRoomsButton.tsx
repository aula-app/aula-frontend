import AppIcon from '@/components/AppIcon';
import { getRooms } from '@/services/rooms';
import { getUserRooms } from '@/services/users';
import { RoomType } from '@/types/Scopes';
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
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  items?: string[];
  onSubmit: () => void;
}

const AddRoomButton: React.FC<Props> = ({ disabled = false, items = [], onSubmit, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const fetchRooms = useCallback(async () => {
    const response = await getRooms();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setRooms(response.data);
  }, []);

  const fetchUserRoom = useCallback(async (id: string) => {
    const response = await getUserRooms(id);
    if (!response.error && response.data)
      console.log(`user: ${id} => rooms: ${response.data.map((room) => room.room_id)}`);
  }, []);

  const getOwnRooms = () => {
    items.forEach((item) => {
      fetchUserRoom(item);
    });
  };

  const toggleRoom = (id: string) => {
    if (selectedRooms.includes(id)) {
      setSelectedRooms(selectedRooms.filter((room) => room !== id));
    } else {
      setSelectedRooms([...selectedRooms, id]);
    }
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRooms([]);
  };

  useEffect(() => {
    fetchRooms();
    if (items.length > 0) {
      getOwnRooms();
    }
  }, [items]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} {...restOfProps}>
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
                  <Checkbox checked={selectedRooms.includes(room.hash_id)} />
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
          <Button variant="contained">{t('actions.confirm')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddRoomButton;
