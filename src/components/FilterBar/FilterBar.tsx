import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { announceToScreenReader, STATUS } from '@/utils';
import { Collapse, Stack, Typography, Tooltip, StackProps } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import FilterSelect from './FilterSelect';
import FilterStatus from './FilterStatus';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

interface FilterBarProps extends StackProps {
  children?: React.ReactNode;
  scope: SettingNamesType;
  fields?: Array<keyof PossibleFields>;
  onStatusChange: (status: StatusTypes) => void;
  onFilterChange: (filter: [keyof PossibleFields, string]) => void;
}

const FilterBar: FC<FilterBarProps> = ({ children, fields, scope, onStatusChange, onFilterChange, ...restOfProps }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState<StatusTypes>(1);
  const filterSelectRef = useRef<HTMLDivElement>(null);

  const handleStatusChange = (newStatus: StatusTypes) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const toggleFilters = () => {
    const newIsOpen = !isOpen;
    setOpen(newIsOpen);

    // Announce to screen readers that filters have been toggled
    if (newIsOpen) {
      announceToScreenReader(t('ui.accessibility.filtersOpened'), 'polite');
    } else {
      announceToScreenReader(t('ui.accessibility.filtersClosed'), 'polite');
    }
  };

  // Focus the first filter control when filters are opened
  useEffect(() => {
    if (isOpen && filterSelectRef.current) {
      // Wait for the collapse animation to complete
      const timeoutId = setTimeout(() => {
        const firstInput = filterSelectRef.current?.querySelector('input, select, button') as HTMLElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 300); // Adjust based on your collapse animation duration

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts for the filter panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setOpen(false);
      // Return focus to the filter button
      const filterButton = document.getElementById('filter-toggle-button');
      if (filterButton) {
        filterButton.focus();
      }
    }
  };

  return (
    <Stack gap={1} onKeyDown={handleKeyDown} {...restOfProps}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">{t(`scopes.${scope}.plural`)}</Typography>
        {fields && (
          <Stack direction="row" px={2}>
            <Tooltip title={isOpen ? t('actions.hideFilters') : t('actions.showFilters')}>
              <AppIconButton
                icon="filter"
                onClick={toggleFilters}
                id="filter-toggle-button"
                data-testid="filter-toggle-button"
                aria-expanded={isOpen}
                aria-controls="filter-panel"
                aria-label={isOpen ? t('actions.hideFilters') : t('actions.showFilters')}
              />
            </Tooltip>
          </Stack>
        )}
      </Stack>
      {fields && (
        <Collapse in={isOpen} id="filter-panel" role="region" aria-label={t('actions.filter')} data-testid="filter-panel">
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            ref={filterSelectRef}
            tabIndex={-1} // Makes the container focusable for screen readers but not in tab order
          >
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
