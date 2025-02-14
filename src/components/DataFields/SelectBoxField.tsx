import { getBoxes } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { MenuItem, TextField } from '@mui/material';
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
  const [boxes, setBoxes] = useState<SelectOptionsType>([]);
  const [value, setValue] = useState<string>('');

  const fetchBoxes = async () => {
    const response = await getBoxes();
    if (!response.error && response.data) createOptions(response.data as BoxType[]);
  };

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  const createOptions = (data: BoxType[]) => {
    setBoxes(
      data.map((option) => {
        return { label: option.name, value: option.hash_id };
      })
    );
  };

  useEffect(() => {
    setValue(defaultValue || box_id || '');
  }, [boxes]);

  useEffect(() => {
    fetchBoxes();
  }, []);

  return (
    <TextField
      label={t(`scopes.boxes.name`)}
      disabled={disabled}
      select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
      {...restOfProps}
      slotProps={{ inputLabel: { shrink: true } }}
    >
      {boxes.map((option) => (
        <MenuItem value={option.value} key={option.value}>
          {t(option.label)}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectBoxField;
