import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';
import FilterInput from './FilterInput';
import FilterRoom from './FilterRoom';

type Params = {
  filter: [string, string];
  statusOptions?: typeof STATUS;
  status?: StatusTypes;
  isOpen: boolean;
  scope: SettingNamesType;
  room: number;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
  setRoom: Dispatch<SetStateAction<number>>;
};

const FilterBar = ({ filter, status, statusOptions, scope, room, isOpen, setFilter, setStatus, setRoom }: Params) => (
  <Collapse in={isOpen}>
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <Stack direction="row" alignItems="center" p={2} pt={0} gap={1}>
        <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
        <FilterInput filter={filter} setFilter={setFilter} />
        {scope === 'users' && <FilterRoom room={room} setRoom={setRoom} />}
        {statusOptions && setStatus && typeof status !== 'undefined' && (
          <FilterStatus options={statusOptions} status={status} setStatus={setStatus} />
        )}
      </Stack>
    </Stack>
  </Collapse>
);

export default FilterBar;
