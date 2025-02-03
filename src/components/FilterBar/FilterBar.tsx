import { StatusTypes } from '@/types/Generics';
import { RoleTypes, SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import SelectRoom from '../SelectRoom';
import FilterInput from './FilterInput';
import FilterRole from './FilterRole';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';
import { PossibleFields } from '@/types/Scopes';
import AppIconButton from '../AppIconButton';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

type Params = {
  title: string;
  filter: [keyof PossibleFields, string];
  status?: StatusTypes;
  role?: RoleTypes | -1;
  scope: SettingNamesType;
  target?: number;
  setFilter: Dispatch<SetStateAction<[keyof PossibleFields, string]>>;
  setRole?: Dispatch<SetStateAction<RoleTypes | -1>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
  setTarget?: Dispatch<SetStateAction<number>>;
};

const FilterBar = ({
  filter,
  role,
  status,
  scope,
  target,
  title,
  setFilter,
  setRole,
  setStatus,
  setTarget,
}: Params) => {
  const [isOpen, setOpen] = useState(false);
  const setRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (setTarget) setTarget(Number(event.target.value));
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{title}</Typography>
        <Stack direction="row" px={2}>
          <AppIconButton icon="filter" onClick={() => setOpen(!isOpen)} />
        </Stack>
      </Stack>
      <Collapse in={isOpen}>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
            <FilterInput filter={filter} setFilter={setFilter} />
          </Stack>
          <Stack direction="row" alignItems="center" gap={1} flex={1}>
            {['users', 'ideas'].includes(scope) && typeof target === 'number' && setTarget && (
              <SelectRoom room={target} setRoom={setRoom} />
            )}
            {scope === 'users' && typeof role === 'number' && setRole && <FilterRole role={role} setRole={setRole} />}
            {setStatus && typeof status !== 'undefined' && (
              <FilterStatus
                options={scope === 'reports' ? [STATUS[1], STATUS[3]] : STATUS}
                status={status}
                setStatus={setStatus}
              />
            )}
          </Stack>
        </Stack>
      </Collapse>
    </>
  );
};

export default FilterBar;
