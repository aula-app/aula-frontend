import { getBoxes } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput from '@/v2/components/input/SelectInput';

interface BoxFieldProps {
  roomId: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BoxField: React.FC<BoxFieldProps> = ({ roomId, value, onChange, disabled = false }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    const fetchBoxes = async () => {
      if (!roomId) return;
      setLoading(true);
      const response = await getBoxes({ room_id: roomId, offset: 0, limit: 0 });
      setLoading(false);
      if (!response.error && response.data) {
        const boxOptions = (response.data as BoxType[]).map((box) => ({
          value: box.hash_id,
          label: box.name,
        }));
        setOptions(boxOptions);
      }
    };

    fetchBoxes();
  }, [roomId]);

  return (
    <SelectInput
      label={t('scopes.boxes.name')}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
    />
  );
};

export default BoxField;
