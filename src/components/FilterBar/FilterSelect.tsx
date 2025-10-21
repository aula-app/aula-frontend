import { PossibleFields } from '@/types/Scopes';
import { announceToScreenReader } from '@/utils';
import { FilledInput, FormHelperText, InputLabel, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';

type Props = {
  fields: Array<keyof PossibleFields>;
  onChange: (filter: [keyof PossibleFields, string]) => void;
};

const FilterSelect: React.FC<Props> = ({ fields, onChange }) => {
  const { t } = useTranslation();
  const [key, setKey] = useState<keyof PossibleFields>('');
  const [filterValue, setFilterValue] = useState('');
  const filterInputRef = useRef<HTMLInputElement>(null);
  const filterSelectRef = useRef<HTMLInputElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const selectedKey = event.target.value as keyof PossibleFields;
    setKey(selectedKey);

    // Reset filter value when key changes
    if (selectedKey === '') {
      setFilterValue('');
      announceToScreenReader(t('ui.accessibility.filterCleared'), 'polite');
    } else {
      // When a filter field is selected, announce it and focus the input field
      announceToScreenReader(
        t('ui.accessibility.filterFieldSelected', { field: t(`settings.columns.${selectedKey}`) }),
        'polite'
      );

      // Focus the filter input field after a field is selected
      setTimeout(() => {
        if (filterInputRef.current) {
          filterInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleFilterChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleClearFilter = () => {
    setFilterValue('');
    announceToScreenReader(t('ui.accessibility.filterValueCleared'), 'polite');

    // Return focus to the input field after clearing
    setTimeout(() => {
      if (filterInputRef.current) {
        filterInputRef.current.focus();
      }
    }, 100);
  };

  // Handle keyboard interactions
  const handleFilterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // If Escape is pressed in the filter input, clear the filter
    if (event.key === 'Escape' && filterValue !== '') {
      event.preventDefault();
      handleClearFilter();
    }

    // If Backspace is pressed in an empty filter input, move focus back to the select
    if (event.key === 'Backspace' && filterValue === '') {
      filterSelectRef.current?.focus();
    }
  };

  useEffect(() => {
    onChange([key, filterValue || '']);

    // Announce filter changes to screen readers if both key and value are set
    if (key && filterValue) {
      announceToScreenReader(
        t('ui.accessibility.filterApplied', {
          field: t(`settings.columns.${key}`),
          value: filterValue,
        }),
        'polite'
      );
    }
  }, [key, filterValue]);

  return (
    <Stack direction="row" alignItems="center" gap={1} role="search">
      <TextField
        select
        id="filter-field-select"
        label={t('actions.filter')}
        value={key}
        onChange={handleKeyChange}
        variant="filled"
        size="small"
        inputRef={filterSelectRef}
        sx={{ minWidth: 130 }}
        aria-label={t('ui.accessibility.selectFilterField')}
        data-testid="filter-select"
      >
        <MenuItem value="">&nbsp;</MenuItem>
        {fields.map((column) => (
          <MenuItem value={column} key={column} role="option" aria-selected={key === column}>
            {t(`settings.columns.${column}`)}
          </MenuItem>
        ))}
      </TextField>

      <div>
        <FilledInput
          size="small"
          onChange={handleFilterChange}
          onKeyDown={handleFilterKeyDown}
          value={filterValue}
          disabled={key === ''}
          inputRef={filterInputRef}
          placeholder={key ? t('ui.accessibility.enterFilterValue') : ''}
          data-testid="filter-input"
          aria-label={
            key
              ? t('ui.accessibility.filterValueFor', { field: t(`settings.columns.${key}`) })
              : t('ui.accessibility.selectFieldFirst')
          }
          id="filter-value-input"
          aria-describedby="filter-input-helper"
          endAdornment={
            <Tooltip title={t('ui.accessibility.clearFilter')}>
              <AppIconButton
                icon="close"
                onClick={handleClearFilter}
                disabled={key === ''}
                ref={clearButtonRef}
                aria-label={t('ui.accessibility.clearFilter')}
                data-testid="clear-filter-button"
              />
            </Tooltip>
          }
        />
        <FormHelperText
          id="filter-input-helper"
          sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
        >
          {key ? t('ui.accessibility.filterValueHelp') : t('ui.accessibility.selectFieldFirst')}
        </FormHelperText>
      </div>
    </Stack>
  );
};

export default FilterSelect;
