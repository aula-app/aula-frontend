import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput from '@/v2/components/input/SelectInput';

interface RoomFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RoomField: React.FC<RoomFieldProps> = ({ value, onChange, disabled = false }) => {
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
    />
  );
};

export default RoomField;
