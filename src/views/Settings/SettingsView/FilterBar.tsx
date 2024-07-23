import AppIconButton from '@/components/AppIconButton';
import { SettingNamesType } from '@/types/SettingsTypes';
import { dataSettings } from '@/utils';
import { Collapse, FilledInput, MenuItem, Stack, TextField } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  filter: [string, string];
  isOpen: boolean;
  scope: SettingNamesType;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
};

const FilterBar = ({ scope, filter, isOpen, setFilter }: Params) => {
  const { t } = useTranslation();

  const changeFilter = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([event.target.value, filter[1]]);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  return (
    <Collapse in={isOpen}>
      <Stack direction="row" alignItems="center" p={2} pt={0}>
        <TextField
          select
          label="Column"
          value={filter[0]}
          onChange={changeFilter}
          variant="filled"
          size="small"
          sx={{ width: 100, mr: 1 }}
        >
          <MenuItem value="">&nbsp;</MenuItem>
          {dataSettings[scope].map((column) => (
            <MenuItem value={column.name} key={column.name}>
              {t(`settings.${column.name}`)}
            </MenuItem>
          ))}
        </TextField>
        <FilledInput
          size="small"
          onChange={changeSearch}
          value={filter[1]}
          disabled={filter[0] === ''}
          endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
        />
      </Stack>
    </Collapse>
  );
};

export default FilterBar;
