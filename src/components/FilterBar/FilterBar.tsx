import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
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

const FilterBar = ({ filter, status, statusOptions, scope, isOpen, setFilter, setStatus }: Params) => (
  <Collapse in={isOpen}>
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <Stack direction="row" alignItems="center" p={2} pt={0} gap={1}>
        <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
      </Stack>
      {setStatus && typeof status !== 'undefined' && <FilterStatus setStatus={setStatus} />}
    </Stack>
  </Collapse>
);

export default FilterBar;
