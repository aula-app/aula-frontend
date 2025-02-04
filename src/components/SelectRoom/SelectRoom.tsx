import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  room: string | '';
  setRoom: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SelectRoom = ({ room, setRoom }: Params) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Array<RoomType>>([]);

  const fetchRooms = useCallback(async () => {
    const response = await getRooms();
    if (!response.error && response.data) setRooms(response.data);
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <TextField
      select
      label={t('scopes.rooms.name')}
      value={room}
      onChange={(event) => setRoom(event.target.value)}
      variant="filled"
      size="small"
      sx={{ minWidth: 200 }}
      disabled={rooms.length === 0}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {rooms.map((room) => (
        <MenuItem value={room.hash_id} key={room.hash_id}>
          {room.room_name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectRoom;
