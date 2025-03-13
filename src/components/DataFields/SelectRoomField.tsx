import { getAllRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form-mui';
import { useParams } from 'react-router-dom';
import SelectField from './SelectField';

interface Props {
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  disabled?: boolean;
}

/**
 * Renders "SelectInput" component
 */

const SelectRoomField: React.FC<Props> = ({ control, setValue, disabled = false, ...restOfProps }) => {
  const [rooms, setRooms] = useState<SelectOptionsType>([]);
  const { room_id } = useParams();

  const fetchRooms = async () => {
    const response = await getAllRooms();
    if (response.error || !response.data) return;
    createOptions(response.data as RoomType[]);
    setDefault(response.data as RoomType[]);
  };

  const createOptions = (data: RoomType[]) => {
    setRooms(
      data.map((option) => {
        return { label: option.room_name, value: option.hash_id };
      })
    );
  };

  const setDefault = (data: RoomType[]) => {
    const newDefault = data.find((room) => room.type === 1)?.hash_id;
    if (newDefault) setValue('room_hash_id', room_id || newDefault);
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
      {...restOfProps}
    />
  );
};

export default SelectRoomField;
