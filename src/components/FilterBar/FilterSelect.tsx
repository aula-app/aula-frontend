import { PossibleFields } from '@/types/Scopes';
import { FilledInput, MenuItem, Stack, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';

type Props = {
  fields: Array<keyof PossibleFields>;
  onChange: (filter: [keyof PossibleFields, string]) => void;
};

const FilterSelect: React.FC<Props> = ({ fields, onChange }) => {
  const { t } = useTranslation();
  const [key, setKey] = useState<keyof PossibleFields>('');
  const [filterValue, setFilterValue] = useState('');

  const handleKeyChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const selectedKey = event.target.value as keyof PossibleFields;
    setKey(selectedKey);

    // Reset filter value when key changes
    if (selectedKey === '') {
      setFilterValue('');
    }
  };

  const handleFilterChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleClearFilter = () => {
    setFilterValue('');
  };

  useEffect(() => {
    onChange([key, filterValue || '']);
  }, [key, filterValue]);

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <TextField
        select
        id="filter-select-1"
        label={t('actions.filter')}
        value={key}
        onChange={handleKeyChange}
        variant="filled"
        size="small"
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">&nbsp;</MenuItem>
        {fields.map((column) => (
          <MenuItem value={column} key={column}>
            {t(`settings.columns.${column}`)}
          </MenuItem>
        ))}
      </TextField>

      <FilledInput
        size="small"
        id="filter-select-2"
        onChange={handleFilterChange}
        value={filterValue}
        disabled={key === ''}
        endAdornment={filterValue && <AppIconButton icon="close" onClick={handleClearFilter} disabled={key === ''} />}
      />
    </Stack>
  );
};

export default FilterSelect;
