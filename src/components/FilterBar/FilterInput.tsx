import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import { FilledInput, MenuItem, TextField } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import { RoomType } from '@/types/Scopes';

type Params = {
  filter: [string, string];
  scope: SettingNamesType;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
};

const FilterInput = ({ filter, scope, setFilter }: Params) => {
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

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  useEffect(() => {
    if (scope === 'users') getRooms();
  }, []);

  switch (filter[0]) {
    case 'room_id':
      <TextField
        select
        label={t('texts.filter')}
        value={filter[1]}
        onChange={changeSearch}
        variant="filled"
        size="small"
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">&nbsp;</MenuItem>
        {rooms &&
          rooms.map((room) => (
            <MenuItem value={room.id} key={room.room_name}>
              {room.room_name}
            </MenuItem>
          ))}
      </TextField>;
    default:
      return (
        <FilledInput
          size="small"
          onChange={changeSearch}
          value={filter[1]}
          disabled={filter[0] === ''}
          endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
        />
      );
  }
};

export default FilterInput;
