import { getBoxes } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { SelectOptionsType, SelectOptionType } from '@/types/SettingsTypes';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Props {
  onChange: (value: string) => void;
  defaultValue: string;
  disabled?: boolean;
}

/**
 * Renders "SelectInput" component
 */

const SelectBoxField: React.FC<Props> = ({ defaultValue, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const { box_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [boxes, setBoxes] = useState<{ label: string; value: string }[]>([{ label: '', value: '' }]);
  const [value, setValue] = useState<{ label: string; value: string }>({ label: '', value: '' });

  const fetchBoxes = async () => {
    setLoading(true);
    const response = await getBoxes();
    setLoading(false);
    if (!response.error && response.data) createOptions(response.data as BoxType[]);
  };

  const createOptions = (data: BoxType[]) => {
    setBoxes(data.map((option) => ({ label: option.name, value: option.hash_id })));
  };

  const handleChange = (value: { label: string; value: string } | null) => {
    const selected = boxes.filter((box) => box.value === value?.value)[0];
    setValue(selected);
    onChange(value?.value || '');
  };

  useEffect(() => {
    const currentId = defaultValue || box_id || '';
    setValue(boxes.filter((box) => box.value === currentId)[0]);
  }, [boxes]);

  useEffect(() => {
    fetchBoxes();
  }, []);

  return (
    <Autocomplete
      fullWidth
      value={value || ''}
      onChange={(_, value) => handleChange(value)}
      id="controllable-states-demo"
      loading={loading}
      options={boxes}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={t(`scopes.boxes.name`)} />}
    />
  );
};

export default SelectBoxField;
