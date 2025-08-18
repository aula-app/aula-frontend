import { AppIcon, AppIconButton } from '@/components';
import {
  Collapse,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ScopeHeaderProps {
  title: string;
  scopeKey: string; // For translation keys like 'rooms', 'ideas', etc.
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: string;
  onSortKeyChange: (value: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (value: 'asc' | 'desc') => void;
  // Sort options specific to the scope
  sortOptions?: Array<{
    value: string;
    labelKey: string;
  }>;
}
export function ScopeHeader({
  title,
  scopeKey,
  totalCount,
  searchQuery,
  onSearchChange,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions = [
    { value: 'created', labelKey: 'ui.sort.created' },
    { value: 'last_update', labelKey: 'ui.sort.updated' },
  ],
}: ScopeHeaderProps) {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSortOpen) setIsSortOpen(false); // Close sort when opening search
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (isSearchOpen) setIsSearchOpen(false); // Close search when opening sort
  };

  const handleSortDirectionToggle = () => {
    onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Close sort panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Don't close if clicking within the sort container
      if (sortRef.current && sortRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on the search button (let search handle its own logic)
      if (target.closest('#search-button')) {
        return;
      }

      // Don't close if clicking on MUI Select dropdown items (they're rendered in portals)
      if (target.closest('[role="listbox"]') || target.closest('[role="option"]') || target.closest('.MuiPaper-root')) {
        return;
      }

      setIsSortOpen(false);
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

  // Close search panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Don't close if clicking within the search container
      if (searchRef.current && searchRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on the sort button (let sort handle its own logic)
      if (target.closest('#sort-button')) {
        return;
      }

      // Don't close if clicking on MUI components that might be rendered in portals
      if (target.closest('[role="listbox"]') || target.closest('[role="option"]') || target.closest('.MuiPaper-root')) {
        return;
      }

      setIsSearchOpen(false);
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ pb: 2 }}
      role="banner"
      aria-labelledby={`${scopeKey}-heading`}
    >
      <Typography
        variant="h1"
        className="noSpace"
        sx={{
          scrollSnapAlign: 'start',
          transition: 'all .5s ease-in-out',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
        component="h1"
        id={`${scopeKey}-heading`}
        aria-live="polite"
        aria-atomic="true"
      >
        {totalCount} {title}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ flexShrink: 0 }}
        role="toolbar"
        aria-label={t('ui.accessibility.actionToolbar')}
      >
        <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            ref={searchRef}
            role="search"
            aria-label={t('ui.common.search')}
          >
            <Collapse
              orientation="horizontal"
              in={isSearchOpen}
              aria-expanded={isSearchOpen}
              role="region"
              aria-labelledby="search-button"
            >
              <TextField
                label={t('ui.common.search')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t(`scopes.${scopeKey}.search.placeholder`)}
                size="small"
                variant="outlined"
                autoFocus
                sx={{ width: 250, minWidth: 150 }}
                aria-describedby={`search-description-${scopeKey}`}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon icon="search" />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    'aria-label': t('ui.common.search') + ' ' + title,
                    role: 'searchbox',
                  },
                }}
              />
            </Collapse>
            <AppIconButton
              id="search-button"
              icon={isSearchOpen ? 'close' : 'search'}
              onClick={handleSearchToggle}
              color={isSearchOpen ? 'primary' : 'default'}
              aria-label={t('ui.common.search')}
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? `search-field-${scopeKey}` : undefined}
              aria-describedby={`search-description-${scopeKey}`}
              title={isSearchOpen ? t('actions.close') : t('ui.common.search')}
            />
          </Stack>
          <Stack direction="row" alignItems="center" ref={sortRef} role="group" aria-label={t('ui.sort.controls')}>
            <Collapse
              orientation="horizontal"
              in={isSortOpen}
              aria-expanded={isSortOpen}
              role="region"
              aria-labelledby="sort-button"
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <FormControl
                  size="small"
                  sx={{ width: 200, minWidth: 120 }}
                  aria-describedby={`sort-description-${scopeKey}`}
                >
                  <InputLabel id={`sort-label-${scopeKey}`}>{t('ui.sort.by')}</InputLabel>
                  <Select
                    value={sortKey}
                    variant="outlined"
                    size="small"
                    onChange={(e) => onSortKeyChange(e.target.value)}
                    label={t('ui.sort.by')}
                    labelId={`sort-label-${scopeKey}`}
                    id={`sort-select-${scopeKey}`}
                    aria-describedby={`sort-description-${scopeKey}`}
                    inputProps={{
                      'aria-label': t('ui.sort.by') + ' ' + title,
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} aria-label={t(option.labelKey)}>
                        {t(option.labelKey)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <AppIconButton
                  icon={sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
                  onClick={handleSortDirectionToggle}
                  aria-label={t(`ui.sort.${sortDirection}`)}
                  title={t(`ui.sort.${sortDirection}`)}
                />
              </Stack>
            </Collapse>
            <AppIconButton
              id="sort-button"
              icon={isSortOpen ? 'close' : sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
              onClick={handleSortToggle}
              color={isSortOpen ? 'primary' : 'default'}
              aria-label={t('ui.sort.by')}
              aria-expanded={isSortOpen}
              aria-controls={isSortOpen ? `sort-select-${scopeKey}` : undefined}
              aria-describedby={`sort-description-${scopeKey}`}
              title={isSortOpen ? t('actions.close') : t('ui.sort.by')}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
