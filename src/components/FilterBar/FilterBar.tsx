import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';
import FilterInput from './FilterInput';
import FilterRoom from './FilterRoom';
import FilterGroup from './FilterGroup';

type Params = {
  isOpen: boolean;
  filter: [string, string];
  statusOptions?: typeof STATUS;
  status?: StatusTypes;
  scope: SettingNamesType;
  target?: number;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
  setTarget?: Dispatch<SetStateAction<number>>;
};

const FilterBar = ({
  filter,
  status,
  statusOptions,
  scope,
  target,
  isOpen,
  setFilter,
  setStatus,
  setTarget,
}: Params) => {
  const setRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (setTarget) setTarget(Number(event.target.value));
  };

  return (
    <Collapse in={isOpen}>
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <Stack direction="row" alignItems="center" p={2} pt={0} gap={1}>
          <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
          <FilterInput filter={filter} setFilter={setFilter} />
          {scope === 'users' && typeof target === 'number' && setTarget && (
            <FilterRoom room={target} setRoom={setRoom} />
          )}
          {statusOptions && setStatus && typeof status !== 'undefined' && (
            <FilterStatus options={statusOptions} status={status} setStatus={setStatus} />
          )}
        </Stack>
      </Stack>
    </Collapse>
  );
};

export default FilterBar;
