import { useMemo } from 'react';

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

// Pre-built filter functions for common use cases

/**
 * Generic text search filter that searches in specified fields
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
 * Status filter for items with status field
 */
export function createStatusFilter<T extends { status: any }>(): FilterFunction<T> {
  return (items: T[], statusValue: string) => {
    if (!statusValue) return items;
    return items.filter((item) => item.status.toString() === statusValue);
  };
}

/**
 * Type filter for rooms (type 0 or 1)
 */
export function createRoomTypeFilter<T extends { type: 0 | 1 }>(): FilterFunction<T> {
  return (items, typeValue: string) => {
    if (!typeValue) return items;
    const typeNumber = parseInt(typeValue, 10);
    return items.filter((item) => item.type === typeNumber);
  };
}
