import { useMemo, useState } from 'react';

/**
 * @fileoverview Comprehensive filtering, searching, and sorting utilities
 *
 * This file provides three levels of functionality:
 * 1. useFilter() - Basic data filtering
 * 2. useSearchAndSort() - UI state management for search/sort controls
 * 3. useFilteredData() - Complete solution combining both
 *
 * @example Basic filtering
 * const filtered = useFilter({
 *   data: rooms,
 *   filterValue: searchQuery,
 *   filterFunction: createTextFilter(['name', 'description'])
 * });
 *
 * @example Search and sort state
 * const { searchQuery, sortKey, scopeHeaderProps } = useSearchAndSort({
 *   sortOptions: [{ value: 'name', labelKey: 'ui.sort.name' }]
 * });
 *
 * @example Complete solution
 * const { filteredData, scopeHeaderProps } = useFilteredData({
 *   data: rooms,
 *   filterFunction: createTextFilter(['name']),
 *   sortOptions: [{ value: 'name', labelKey: 'ui.sort.name' }]
 * });
 */

// ============================================================================
// CORE FILTERING FUNCTIONALITY
// ============================================================================

export type FilterFunction<T> = (items: T[], filterValue: string) => T[];

export interface UseFilterOptions<T> {
  data: T[];
  filterValue: string;
  filterFunction: FilterFunction<T>;
}

/**
 * Generic hook for filtering data based on a filter value and custom filter function
 */
export function useFilter<T>({ data, filterValue, filterFunction }: UseFilterOptions<T>) {
  const filteredData = useMemo(() => {
    if (!filterValue.trim()) {
      return data;
    }
    return filterFunction(data, filterValue);
  }, [data, filterValue, filterFunction]);

  return filteredData;
}

// ============================================================================
// SEARCH AND SORT STATE MANAGEMENT
// ============================================================================

export interface SortOption {
  value: string;
  labelKey: string;
}

export interface UseSearchAndSortOptions {
  defaultSortKey?: string; // If not provided, uses first sort option
  defaultSortDirection?: 'asc' | 'desc';
  sortOptions?: SortOption[];
}

export interface SearchAndSortState {
  searchQuery: string;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
}

/**
 * Hook for managing search and sort state with ScopeHeader-compatible props
 * Provides both individual state values and ready-to-spread props for UI components
 */
export function useSearchAndSort(options: UseSearchAndSortOptions = {}) {
  const {
    defaultSortDirection = 'asc',
    sortOptions = [
      { value: 'created', labelKey: 'ui.sort.created' },
      { value: 'last_update', labelKey: 'ui.sort.updated' },
    ],
  } = options;

  // Use the first sort option as default if no defaultSortKey is provided
  const defaultSortKey = options.defaultSortKey ?? sortOptions[0]?.value ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const handleSortKeyChange = (value: string) => {
    setSortKey(value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortKey(defaultSortKey);
    setSortDirection(defaultSortDirection);
  };

  return {
    // Individual state values for external use (e.g., API calls)
    searchQuery,
    sortKey,
    sortDirection,

    // State setters for advanced use cases
    setSearchQuery,
    setSortKey,
    setSortDirection,

    // Utility functions
    resetFilters,

    // Props ready to spread into ScopeHeader component
    scopeHeaderProps: {
      searchQuery,
      onSearchChange: setSearchQuery,
      sortKey,
      onSortKeyChange: handleSortKeyChange,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      sortOptions,
    },
  };
}

// Backward compatibility alias
export const useScopeHeader = useSearchAndSort;

// ============================================================================
// COMBINED DATA MANAGEMENT HOOK
// ============================================================================

export interface UseFilteredDataOptions<T> extends UseSearchAndSortOptions {
  data: T[];
  filterFunction: FilterFunction<T>;
}

/**
 * Complete data management hook that combines filtering, searching, and sorting
 * Perfect for list views that need all functionality in one place
 */
export function useFilteredData<T>({ data, filterFunction, ...searchSortOptions }: UseFilteredDataOptions<T>) {
  const searchAndSort = useSearchAndSort(searchSortOptions);
  const { searchQuery } = searchAndSort;

  const filteredData = useFilter({
    data,
    filterValue: searchQuery,
    filterFunction,
  });

  return {
    ...searchAndSort,
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
  };
}

// ============================================================================
// PRE-BUILT FILTER FUNCTIONS
// ============================================================================

/**
 * Creates a text search filter that searches in specified fields
 */
export function createTextFilter<T>(searchFields: (keyof T)[]): FilterFunction<T> {
  return (items: T[], searchValue: string) => {
    const lowercaseSearch = searchValue.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(lowercaseSearch);
        }
        if (typeof fieldValue === 'number') {
          return fieldValue.toString().includes(lowercaseSearch);
        }
        return false;
      })
    );
  };
}

/**
 * Creates a status-based filter for items with status field
 */
export function createStatusFilter<T extends { status: any }>(): FilterFunction<T> {
  return (items: T[], statusValue: string) => {
    if (!statusValue) return items;
    return items.filter((item) => item.status.toString() === statusValue);
  };
}

/**
 * Creates a room type filter (for type 0 or 1)
 */
export function createRoomTypeFilter<T extends { type: 0 | 1 }>(): FilterFunction<T> {
  return (items, typeValue: string) => {
    if (!typeValue) return items;
    const typeNumber = parseInt(typeValue, 10);
    return items.filter((item) => item.type === typeNumber);
  };
}
