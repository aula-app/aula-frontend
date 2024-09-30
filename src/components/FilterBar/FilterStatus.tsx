import { StatusTypes } from '@/types/Generics';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  options: {
    label: string;
    value: number;
  }[];
  status: StatusTypes;
  setStatus: Dispatch<SetStateAction<StatusTypes>>;
};

const FilterStatus = ({ options, status, setStatus }: Params) => {
  const { t } = useTranslation();

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!setStatus) return;
    setStatus(Number(event.target.value) as StatusTypes);
  };

  return (
    <TextField
      select
      label={t('settings.status')}
      value={status}
      onChange={changeStatus}
      variant="filled"
      size="small"
      sx={{ minWidth: 200 }}
    >
      {options.map((column) => (
        <MenuItem value={column.value} key={column.label}>
          {t(column.label)}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FilterStatus;
