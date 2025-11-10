import { AppIcon, AppIconButton } from '@/components';
import { ScopeKeyType } from '@/types/Scopes';
import { Collapse, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ScopeHeaderProps {
  title: string;
  scopeKey: ScopeKeyType;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: string;
  onSortKeyChange: (value: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (value: 'asc' | 'desc') => void;
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortSelectRef = useRef<HTMLInputElement>(null);
  const sortDirectionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const clearSearch = () => {
    onSearchChange('');
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) clearSearch();
    setIsSearchOpen(!isSearchOpen);
    if (isSortOpen) setIsSortOpen(false);
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (isSearchOpen && searchQuery.trim() === '') setIsSearchOpen(false);
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

      // Don't close if clicking: within the sort container, on the search button, or on MUI Select dropdown items (they're rendered in portals)
      const conditions =
        (sortRef.current && sortRef.current.contains(target)) ||
        target.closest('#search-button') ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest('.MuiPaper-root');

      if (conditions) {
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

      // Don't close if clicking: within the search container, on the sort button, or on MUI Select dropdown items (they're rendered in portals); or if the search query is not empty (to prevent accidental closure while typing)
      const conditions =
        searchQuery.trim() !== '' ||
        (searchRef.current && searchRef.current.contains(target)) ||
        target.closest('#sort-button') ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest('.MuiPaper-root');

      if (conditions) {
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
  }, [isSearchOpen, searchQuery]);

  // Focus management for search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Delay to allow Collapse animation to complete (300ms timeout + small buffer)
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 350);
    }
  }, [isSearchOpen]);

  // Focus management for sort select
  useEffect(() => {
    if (isSortOpen && sortSelectRef.current) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        sortSelectRef.current?.focus();
      }, 100);
    }
  }, [isSortOpen]);

  // Handle Escape key to close search and sort panels
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          if (searchQuery.trim() === '') {
            clearSearch();
          }
        }
        if (isSortOpen) {
          setIsSortOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, isSortOpen, searchQuery]);

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
                placeholder={t(`scopes.${scopeKey}.placeholder`)}
                size="small"
                variant="outlined"
                inputRef={searchInputRef}
                data-testid="search-field"
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
                  htmlInput: {
                    'aria-label': t('ui.common.search') + ' ' + title,
                    role: 'searchbox',
                  },
                }}
              />
            </Collapse>
            <AppIconButton
              id="search-button"
              data-testid="search-button"
              data-state={isSearchOpen ? 'open' : 'closed'}
              icon={isSearchOpen ? 'close' : 'search'}
              onClick={handleSearchToggle}
              aria-label={t('ui.common.search')}
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? `search-field-${scopeKey}` : undefined}
              aria-describedby={`search-description-${scopeKey}`}
              title={isSearchOpen ? t('actions.close') : t('ui.common.search')}
            />
          </Stack>
          <Stack direction="row" alignItems="center" ref={sortRef} role="group" aria-label={t('ui.sort.by')}>
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
                    data-testid="sort-select"
                    aria-describedby={`sort-description-${scopeKey}`}
                    inputRef={sortSelectRef}
                    inputProps={{
                      'aria-label': t('ui.sort.by') + ' ' + title,
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        data-testid={`sort-option-${option.value}`}
                        aria-label={t(option.labelKey)}
                      >
                        {t(option.labelKey)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <AppIconButton
                  data-testid="sort-direction-button"
                  data-sort-direction={sortDirection}
                  icon={sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
                  onClick={handleSortDirectionToggle}
                  aria-label={t(`ui.sort.${sortDirection}`)}
                  title={t(`ui.sort.${sortDirection}`)}
                />
              </Stack>
            </Collapse>
            <AppIconButton
              id="sort-button"
              data-testid="sort-button"
              data-state={isSortOpen ? 'open' : 'closed'}
              data-sort-direction={sortDirection}
              icon={isSortOpen ? 'close' : sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
              onClick={handleSortToggle}
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
