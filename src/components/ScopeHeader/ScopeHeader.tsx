import { TextField, FormControl, InputLabel, Select, MenuItem, Stack, Box, Typography, Collapse } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppIconButton } from '@/components';

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

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSortOpen) setIsSortOpen(false); // Close sort when opening search
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (isSearchOpen) setIsSearchOpen(false); // Close search when opening sort
  };

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      {/* Header Row - Title, Count, and Action Buttons */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ pt: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h1"
            className="noSpace"
            sx={{
              scrollSnapAlign: 'start',
              transition: 'all .5s ease-in-out',
            }}
            component="h1"
            id={`${scopeKey}-heading`}
          >
            {totalCount} {title}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <AppIconButton
            icon="search"
            onClick={handleSearchToggle}
            color={isSearchOpen ? 'primary' : 'default'}
            aria-label={t('ui.common.search')}
          />
          <AppIconButton
            icon="sort"
            onClick={handleSortToggle}
            color={isSortOpen ? 'primary' : 'default'}
            aria-label={t('ui.sort.by')}
          />
        </Box>
      </Box>

      {/* Collapsible Search Field */}
      <Collapse in={isSearchOpen}>
        <TextField
          fullWidth
          label={t('ui.common.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(`scopes.${scopeKey}.search.placeholder`)}
          size="small"
          autoFocus
        />
      </Collapse>

      {/* Collapsible Sort Controls */}
      <Collapse in={isSortOpen}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>{t('ui.sort.by')}</InputLabel>
            <Select value={sortKey} onChange={(e) => onSortKeyChange(e.target.value)} label={t('ui.sort.by')}>
              <MenuItem value="">{t('ui.sort.default')}</MenuItem>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('ui.sort.direction')}</InputLabel>
            <Select
              value={sortDirection}
              onChange={(e) => onSortDirectionChange(e.target.value as 'asc' | 'desc')}
              label={t('ui.sort.direction')}
            >
              <MenuItem value="asc">{t('ui.sort.asc')}</MenuItem>
              <MenuItem value="desc">{t('ui.sort.desc')}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Collapse>
    </Stack>
  );
}
