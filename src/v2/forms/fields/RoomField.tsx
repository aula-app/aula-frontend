import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput, { SelectInputProps } from '@/v2/components/input/SelectInput';

interface RoomFieldProps extends Omit<SelectInputProps, 'options' | 'label' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const RoomField: React.FC<RoomFieldProps> = ({ value, onChange, disabled = false, ...props }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const response = await getRooms();
      setLoading(false);
      if (!response.error && response.data) {
        const roomOptions = (response.data as RoomType[]).map((room) => ({
          value: room.hash_id,
          label: room.room_name,
        }));
        setOptions(roomOptions);
      }
    };

    fetchRooms();
  }, []);

  return (
    <SelectInput
      label={t('scopes.rooms.name')}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      required
      {...props}
    />
  );
};

export default RoomField;
