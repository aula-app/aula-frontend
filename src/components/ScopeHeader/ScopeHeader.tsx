import { AppIconButton } from '@/components';
import { Box, Collapse, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
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

  // Close sort panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
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
      >
        {totalCount} {title}
      </Typography>

      <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} ref={searchRef}>
            <Collapse orientation="horizontal" in={isSearchOpen}>
              <TextField
                label={t('ui.common.search')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t(`scopes.${scopeKey}.search.placeholder`)}
                size="small"
                variant="standard"
                autoFocus
                sx={{ width: 250, minWidth: 150 }}
              />
            </Collapse>
            <AppIconButton
              icon="search"
              onClick={handleSearchToggle}
              color={isSearchOpen ? 'primary' : 'default'}
              aria-label={t('ui.common.search')}
            />
          </Stack>
          <Stack direction="row" alignItems="center" ref={sortRef}>
            <Collapse orientation="horizontal" in={isSortOpen}>
              <FormControl size="small" sx={{ width: 250, minWidth: 150 }}>
                <InputLabel>{t('ui.sort.by')}</InputLabel>
                <Select
                  value={sortKey}
                  variant="standard"
                  size="small"
                  onChange={(e) => onSortKeyChange(e.target.value)}
                  label={t('ui.sort.by')}
                >
                  <MenuItem value="">{t('ui.sort.default')}</MenuItem>
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Collapse>
            <AppIconButton
              icon={sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
              onClick={handleSortToggle}
              color={isSortOpen ? 'primary' : 'default'}
              aria-label={t('ui.sort.by')}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
