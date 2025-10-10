import { StatusTypes } from '@/types/Generics';
import { SettingType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export interface DataTableFilters {
  status: StatusTypes;
  search_field: string;
  search_text: string;
  [key: string]: unknown;
}

export interface DataTableState<T extends SettingType> {
  // Data state
  items: T[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  // Pagination state
  asc: boolean;
  limit: number;
  offset: number;
  orderby: number;

  // Filter state
  filters: DataTableFilters;

  // Edit state
  edit: T | boolean;

  // Actions
  setAsc: React.Dispatch<React.SetStateAction<boolean>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setOrderby: React.Dispatch<React.SetStateAction<number>>;
  setFilters: (filters: Partial<DataTableFilters>) => void;
  setEdit: (edit: T | boolean) => void;
  fetchData: () => Promise<void>;
  deleteItems: (items: Array<string>) => Promise<void>;
  handleClose: () => void;
}

interface UseDataTableStateOptions<T extends SettingType> {
  initialOrderBy: number;
  fetchFn: (params: Record<string, unknown>) => Promise<{ data?: T[] | null; count?: number | null; error?: string | null }>;
  deleteFn: (id: string) => Promise<{ error?: string | null }>;
  filterDependencies?: unknown[];
}

/**
 * Custom hook for managing DataTable state and operations
 * Encapsulates common state management, pagination, filtering, and CRUD operations
 */
export const useDataTableState = <T extends SettingType>({
  initialOrderBy,
  fetchFn,
  deleteFn,
  filterDependencies = [],
}: UseDataTableStateOptions<T>): DataTableState<T> => {
  // Data state
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(initialOrderBy);

  // Filter state
  const [filters, setFiltersState] = useState<DataTableFilters>({
    status: 1,
    search_field: '',
    search_text: '',
  });

  // Edit state
  const [edit, setEdit] = useState<T | boolean>(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetchFn({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      ...filters,
    });
    if (response.error) setError(response.error);
    setItems(response.data || []);
    setTotalItems(response.count || 0);
    setLoading(false);
  }, [asc, limit, offset, orderby, filters, fetchFn]);

  // Delete items
  const deleteItems = useCallback(
    async (itemIds: Array<string>) => {
      await Promise.all(
        itemIds.map(async (id) => {
          const request = await deleteFn(id);
          if (!request.error) {
            handleClose();
          }
        })
      );
    },
    [deleteFn]
  );

  // Handle close/reload
  const handleClose = useCallback(() => {
    setEdit(false);
    fetchData();
  }, [fetchData]);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<DataTableFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [filters.search_field, filters.search_text, filters.status, ...filterDependencies]);

  // Auto-fetch when pagination or filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    totalItems,
    isLoading,
    error,
    asc,
    limit,
    offset,
    orderby,
    filters,
    edit,
    setAsc,
    setLimit,
    setOffset,
    setOrderby,
    setFilters,
    setEdit,
    fetchData,
    deleteItems,
    handleClose,
  };
};
