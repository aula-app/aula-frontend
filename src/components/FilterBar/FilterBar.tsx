import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { RoleTypes, SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import SelectRole from '../SelectRole';
import SelectRoom from '../SelectRoom';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

type Props = {
  scope: SettingNamesType;
  fields?: Array<keyof PossibleFields>;
  onStatusChange: (status: StatusTypes) => void;
  onFilterChange: (filter: [keyof PossibleFields, string]) => void;
  onRoomChange?: (room: string) => void;
  onRoleChange?: (role: RoleTypes | 0) => void;
};

const FilterBar: React.FC<Props> = ({ fields, scope, onStatusChange, onFilterChange, onRoomChange, onRoleChange }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [room, setRoom] = useState('');
  const [role, setRole] = useState<RoleTypes | 0>(0);

  const handleStatusChange = (newStatus: StatusTypes) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{t(`scopes.${scope}.plural`)}</Typography>
        {fields && (
          <Stack direction="row" px={2}>
            <AppIconButton icon="filter" onClick={() => setOpen(!isOpen)} />
          </Stack>
        )}
      </Stack>
      {fields && (
        <Collapse in={isOpen}>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
            <FilterSelect fields={fields} onChange={onFilterChange} />
            <Stack direction="row" alignItems="center" gap={1} flex={1}>
              {typeof onRoomChange !== 'undefined' && <SelectRoom room={room} setRoom={setRoom} />}
              {typeof onRoleChange !== 'undefined' && <SelectRole role={role} setRole={setRole} />}
              <FilterStatus
                options={scope === 'reports' ? [STATUS[1], STATUS[3]] : STATUS}
                status={status}
                setStatus={(newStatus) => handleStatusChange(newStatus as StatusTypes)}
              />
            </Stack>
          </Stack>
        </Collapse>
      )}
    </>
  );
};

export default FilterBar;
