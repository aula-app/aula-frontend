import { useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';
export type SortFunction<T> = (a: T, b: T) => number;

export interface UseSortOptions<T> {
  data: T[];
  sortKey?: keyof T | null;
  sortDirection?: SortDirection;
  customSortFunction?: SortFunction<T>;
}

/**
 * Generic hook for sorting data based on a sort key and direction
 */
export function useSort<T>({ data, sortKey, sortDirection = 'asc', customSortFunction }: UseSortOptions<T>) {
  const sortedData = useMemo(() => {
    if (!sortKey && !customSortFunction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (customSortFunction) {
        const result = customSortFunction(a, b);
        return sortDirection === 'desc' ? -result : result;
      }

      // Use sortKey for default sorting
      if (!sortKey) return 0;

      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortDirection === 'desc' ? -result : result;
      }

      // Number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const result = aValue - bValue;
        return sortDirection === 'desc' ? -result : result;
      }

      // Date comparison (if strings that can be parsed as dates)
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        const result = aDate.getTime() - bDate.getTime();
        return sortDirection === 'desc' ? -result : result;
      }

      // Fallback to string comparison
      const result = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'desc' ? -result : result;
    });

    return sorted;
  }, [data, sortKey, sortDirection, customSortFunction]);

  return sortedData;
}

// Pre-built sort functions for common use cases

/**
 * Sort function for importance order (lower order_importance = higher priority)
 */
export function createImportanceSortFunction<T extends { order_importance: number }>(): SortFunction<T> {
  return (a, b) => a.order_importance - b.order_importance;
}

/**
 * Sort function for created date (newest first)
 */
export function createDateSortFunction<T extends { created: string }>(): SortFunction<T> {
  return (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime();
}

/**
 * Sort function for rooms by type and then by name
 */
export function createRoomSortFunction<T extends { type: 0 | 1; room_name: string }>(): SortFunction<T> {
  return (a, b) => {
    // First sort by type (0 before 1)
    if (a.type !== b.type) {
      return a.type - b.type;
    }
    // Then sort by name alphabetically
    return a.room_name.localeCompare(b.room_name);
  };
}
