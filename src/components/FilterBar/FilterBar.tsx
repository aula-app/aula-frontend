import { StatusTypes } from '@/types/Generics';
import { RoleTypes, SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import FilterInput from './FilterInput';
import FilterRoom from './FilterRoom';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';
import FilterRole from './FilterRole';
import { CropLandscapeOutlined } from '@mui/icons-material';

type Params = {
  isOpen: boolean;
  filter: [string, string];
  statusOptions?: typeof STATUS;
  status?: StatusTypes;
  role?: RoleTypes | -1;
  scope: SettingNamesType;
  target?: number;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
  setRole?: Dispatch<SetStateAction<RoleTypes | -1>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
  setTarget?: Dispatch<SetStateAction<number>>;
};

const FilterBar = ({
  filter,
  role,
  status,
  statusOptions,
  scope,
  target,
  isOpen,
  setFilter,
  setRole,
  setStatus,
  setTarget,
}: Params) => {
  const setRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (setTarget) setTarget(Number(event.target.value));
  };

  return (
    <Collapse in={isOpen}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} p={2} pt={0}>
        <Stack direction="row" alignItems="center" gap={1}>
          <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
          <FilterInput filter={filter} setFilter={setFilter} />
        </Stack>
        <Stack direction="row" alignItems="center" gap={1} flex={1}>
          {['users', 'ideas'].includes(scope) && typeof target === 'number' && setTarget && (
            <FilterRoom room={target} setRoom={setRoom} />
          )}
          {scope === 'users' && typeof role === 'number' && setRole && <FilterRole role={role} setRole={setRole} />}
          {statusOptions && setStatus && typeof status !== 'undefined' && (
            <FilterStatus options={statusOptions} status={status} setStatus={setStatus} />
          )}
        </Stack>
      </Stack>
    </Collapse>
  );
};

export default FilterBar;
