import { RoomType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  room: number | '';
  setRoom: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const SelectRoom = ({ room, setRoom }: Params) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Array<RoomType>>([]);

  const getOptions = async () => {
    await databaseRequest({
      model: 'Room',
      method: 'getRooms',
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setOptions(response.data);
    });
  };

  const changeRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRoom(event);
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <TextField
      select
      label={t('scopes.room.name')}
      value={room}
      onChange={changeRoom}
      variant="filled"
      size="small"
      sx={{ minWidth: 200 }}
      disabled={!options}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {options.map((option) => (
        <MenuItem value={option.id} key={option.id}>
          {option.room_name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectRoom;
