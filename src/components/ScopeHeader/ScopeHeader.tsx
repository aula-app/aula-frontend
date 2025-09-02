import { AppIcon, AppIconButton } from '@/components';
import { ScopeKeyType } from '@/types/Scopes';
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
  scopeKey: ScopeKeyType; // For translation keys like 'rooms', 'ideas', etc.
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
  const isLoadingPreferences = useRef(false);
  const sortDirectionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved preferences on mount
  useEffect(() => {
    if (isLoadingPreferences.current) return;

    try {
      const savedPreferences = localStorage.getItem(`scope-preferences-${scopeKey}`);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        isLoadingPreferences.current = true;

        if (preferences.searchQuery !== undefined && preferences.searchQuery !== searchQuery) {
          onSearchChange(preferences.searchQuery);
        }
        if (preferences.sortKey !== undefined && preferences.sortKey !== sortKey) {
          onSortKeyChange(preferences.sortKey);
        }
        if (preferences.sortDirection !== undefined && preferences.sortDirection !== sortDirection) {
          onSortDirectionChange(preferences.sortDirection);
        }

        // Reset flag after a short delay to allow the updates to complete
        setTimeout(() => {
          isLoadingPreferences.current = false;
        }, 100);
      }
    } catch (error) {
      // Silently handle localStorage errors
      isLoadingPreferences.current = false;
    }
  }, [scopeKey]); // Only depend on scopeKey

  // Save preferences when they change (but not while loading)
  useEffect(() => {
    if (isLoadingPreferences.current) return;

    try {
      const preferences = {
        searchQuery,
        sortKey,
        sortDirection,
      };
      localStorage.setItem(`scope-preferences-${scopeKey}`, JSON.stringify(preferences));
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [scopeKey, searchQuery, sortKey, sortDirection]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSortOpen) setIsSortOpen(false); // Close sort when opening search
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (isSearchOpen) setIsSearchOpen(false); // Close search when opening sort
  };

  const handleSortDirectionToggle = () => {
    // Clear any existing debounce timeout
    if (sortDirectionDebounceRef.current) {
      clearTimeout(sortDirectionDebounceRef.current);
    }

    // Debounce rapid clicks to prevent state race conditions
    sortDirectionDebounceRef.current = setTimeout(() => {
      onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
    }, 150); // 150ms debounce
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

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (sortDirectionDebounceRef.current) {
        clearTimeout(sortDirectionDebounceRef.current);
      }
    };
  }, []);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 2,
        pt: 1,
        minWidth: 0,
        width: '100%',
        maxWidth: '100vw', // Prevent viewport overflow
        scrollSnapAlign: 'start',
      }}
      role="banner"
      aria-labelledby={`${scopeKey}-heading`}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <AppIcon icon={scopeKey} size="large" />
        <Typography
          variant="h1"
          className="noSpace"
          sx={{
            transition: 'all .5s ease-in-out',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            flexShrink: isSearchOpen || isSortOpen ? 1 : 0,
            minWidth: 0,
          }}
          component="h1"
          id={`${scopeKey}-heading`}
          aria-live="polite"
          aria-atomic="true"
        >
          {totalCount} {title}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          flexShrink: 0,
          maxWidth: '70vw',
          minWidth: 0, // Allow shrinking if needed
        }}
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
              timeout={300}
              easing={{
                enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                exit: 'cubic-bezier(0.4, 0, 0.6, 1)',
              }}
            >
              <TextField
                label={t('ui.common.search')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t(`scopes.${scopeKey}.search.placeholder`)}
                size="small"
                variant="outlined"
                autoFocus
                sx={{
                  width: { xs: 180, sm: 200 },
                  minWidth: { xs: 120, sm: 150 },
                  ml: 2,
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                }}
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
              timeout={300}
              easing={{
                enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                exit: 'cubic-bezier(0.4, 0, 0.6, 1)',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <FormControl
                  size="small"
                  sx={{
                    width: { xs: 140, sm: 160, md: 180 },
                    minWidth: { xs: 100, sm: 120 },
                    ml: 2,
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                  }}
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
