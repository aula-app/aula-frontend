import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';
import { Control } from 'react-hook-form-mui';
import { useParams } from 'react-router-dom';
import SelectField from './SelectField';

interface Props {
  control: Control<any, any>;
  disabled?: boolean;
}

/**
 * Renders "SelectInput" component
 */

const SelectRoomField: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const [rooms, setRooms] = useState<SelectOptionsType>([]);
  const { room_id } = useParams();

  const fetchRooms = async () => {
    const response = await getRooms();
    if (!response.error && response.data) createOptions(response.data as RoomType[]);
  };

  const createOptions = (data: RoomType[]) => {
    setRooms(
      data.map((option) => {
        return { label: option.room_name, value: option.hash_id };
      })
    );
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <SelectField
      control={control}
      options={rooms}
      name="room_hash_id"
      disabled={disabled || rooms.length === 0}
      defaultValue={room_id || ''}
    />
  );
};

export default SelectRoomField;
