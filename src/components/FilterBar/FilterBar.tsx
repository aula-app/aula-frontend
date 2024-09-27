import AppIconButton from '@/components/AppIconButton';
import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, FilledInput, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';

type Params = {
  filter: [string, string];
  statusOptions?: typeof STATUS;
  status?: StatusTypes;
  isOpen: boolean;
  scope: SettingNamesType;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
};

const FilterBar = ({ filter, status, statusOptions, scope, isOpen, setFilter, setStatus }: Params) => {
  const { t } = useTranslation();

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  return (
    <Collapse in={isOpen}>
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <Stack direction="row" alignItems="center" p={2} pt={0} gap={1}>
          <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
          <FilledInput
            size="small"
            onChange={changeSearch}
            value={filter[1]}
            disabled={filter[0] === ''}
            endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
          />
        </Stack>
        {setStatus && typeof status !== 'undefined' && <FilterStatus setStatus={setStatus} />}
      </Stack>
    </Collapse>
  );
};

export default FilterBar;
