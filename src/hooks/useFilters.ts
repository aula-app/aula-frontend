import { useCallback, useEffect, useState } from 'react';
import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { useFilter, createTextFilter, createRoomTypeFilter, FilterFunction } from './useFilter';
import { useSort, SortDirection, createRoomSortFunction } from './useSort';

export interface UseRoomsWithFiltersOptions {
  searchQuery?: string;
  roomTypeFilter?: string; // '0', '1', or '' for all
  sortKey?: keyof RoomType | null;
  sortDirection?: SortDirection;
  customFilterFunction?: FilterFunction<RoomType>;
}

/**
 * Hook that combines room data fetching with filtering and sorting capabilities
 */
export function useRoomsWithFilters({
  searchQuery = '',
  roomTypeFilter = '',
  sortKey = null,
  sortDirection = 'asc',
  customFilterFunction,
}: UseRoomsWithFiltersOptions = {}) {
  const [allRooms, setAllRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default filter function that searches in room_name and description_public
  const defaultFilterFunction = createTextFilter<RoomType>(['room_name', 'description_public']);

  // Apply text search filter
  const searchFilteredRooms = useFilter({
    data: allRooms,
    filterValue: searchQuery,
    filterFunction: customFilterFunction || defaultFilterFunction,
  });

  // Apply room type filter
  const typeFilterFunction = createRoomTypeFilter<RoomType>();
  const typeFilteredRooms = useFilter({
    data: searchFilteredRooms,
    filterValue: roomTypeFilter,
    filterFunction: typeFilterFunction,
  });

  // Apply sorting
  const sortedRooms = useSort({
    data: typeFilteredRooms,
    sortKey,
    sortDirection,
    customSortFunction: !sortKey ? createRoomSortFunction<RoomType>() : undefined, // Default sort by type then name
  });

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRooms({
        offset: 0,
        limit: 0,
        type: -1,
      });

      if (response.error) {
        setError(response.error);
        setAllRooms([]);
      } else if (response.data) {
        setAllRooms(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load rooms');
      setAllRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms: sortedRooms,
    allRooms,
    isLoading,
    error,
    refetch: fetchRooms,
    // Computed values for UI
    totalCount: allRooms.length,
    filteredCount: sortedRooms.length,
    hasFilters: searchQuery.trim() !== '' || roomTypeFilter !== '',
  };
}
