import { RoomType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  room: number;
  setRoom: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const FilterRoom = ({ room, setRoom }: Params) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Array<RoomType>>();

  const getRooms = async () => {
    await databaseRequest({
      model: 'Room',
      method: 'getRooms',
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response) => {
      if (!response.success) return;
      setRooms(response.data);
    });
  };

  const changeRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRoom(event);
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <TextField
      select
      label={t('views.room')}
      value={room}
      onChange={changeRoom}
      variant="filled"
      size="small"
      sx={{ minWidth: 282 }}
      disabled={!rooms}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {rooms &&
        rooms.map((room) => (
          <MenuItem value={room.id} key={room.room_name}>
            {room.room_name}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default FilterRoom;
