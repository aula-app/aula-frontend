import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { STATUS } from '@/utils';
import { Collapse, Stack, StackProps, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

interface FilterBarProps extends Omit<StackProps, 'onStatusChange' | 'onFilterChange'> {
  children?: React.ReactNode;
  scope: SettingNamesType;
  fields?: Array<keyof PossibleFields>;
  onStatusChange: (status: StatusTypes) => void;
  onFilterChange: (filter: [keyof PossibleFields, string]) => void;
}

const FilterBar: FC<FilterBarProps> = ({ 
  children, 
  fields, 
  scope, 
  onStatusChange, 
  onFilterChange,
  ...restOfProps
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState<StatusTypes>(1);

  const handleStatusChange = (newStatus: StatusTypes) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <Stack gap={1} {...restOfProps}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">{t(`scopes.${scope}.plural`)}</Typography>
        {fields && (
          <Stack direction="row" px={2}>
            <AppIconButton
              role="button"
              aria-label="button-open-filters"
              aria-description="open filters"
              icon="filter"
              onClick={() => setOpen(!isOpen)}
            />
          </Stack>
        )}
      </Stack>
      {fields && (
        <Collapse in={isOpen}>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
            <FilterSelect fields={fields} onChange={onFilterChange} />
            <Stack direction="row" alignItems="center" gap={1} flex={1}>
              {children}
              <FilterStatus
                options={scope === 'reports' ? [STATUS[1], STATUS[3]] : STATUS}
                status={status}
                setStatus={(newStatus) => handleStatusChange(newStatus as StatusTypes)}
              />
            </Stack>
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

export default FilterBar;
