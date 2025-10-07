import DataTable from '@/components/DataTable/DataTable';
import FilterBar from '@/components/FilterBar';
import { DataTableFilters, DataTableState } from '@/hooks/useDataTableState';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields, SettingType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { Drawer, Stack } from '@mui/material';
import { ReactNode } from 'react';

type Props<T extends SettingType> = {
  scope: SettingNamesType;
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  filterFields: Array<keyof PossibleFields>;
  dataTableState: DataTableState<T>;
  FormComponent: React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>;
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  extraFilters?: ReactNode;
  onFilterChange?: (filters: Partial<DataTableFilters>) => void;
};

/**
 * Generic SettingsView wrapper component
 * Combines FilterBar, DataTable, and edit Drawer into a single reusable component
 * Dramatically reduces boilerplate in Settings views
 */
const SettingsView = <T extends SettingType>({
  scope,
  columns,
  filterFields,
  dataTableState,
  FormComponent,
  extraTools,
  extraFilters,
  onFilterChange,
}: Props<T>) => {
  const {
    items,
    totalItems,
    isLoading,
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
    deleteItems,
    handleClose,
    fetchData,
  } = dataTableState;

  const handleFilterChange = ([field, text]: [string, string]) => {
    const newFilters = { search_field: field, search_text: text };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleStatusChange = (status: StatusTypes) => {
    const newFilters = { status };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Stack flex={1} overflow="hidden" pt={2}>
      <Stack px={2}>
        <FilterBar
          fields={filterFields as Array<string>}
          scope={scope}
          onStatusChange={handleStatusChange}
          onFilterChange={handleFilterChange}
        >
          {extraFilters}
        </FilterBar>
      </Stack>
      <Stack flex={1} overflow="hidden">
        <DataTable
          scope={scope}
          columns={columns}
          rows={items}
          totalItems={totalItems}
          orderAsc={asc}
          orderBy={orderby}
          limit={limit}
          offset={offset}
          setAsc={setAsc}
          setLimit={setLimit}
          setOffset={setOffset}
          setOrderby={setOrderby}
          setEdit={(item) => setEdit(item as T | boolean)}
          setDelete={deleteItems}
          extraTools={extraTools}
          isLoading={isLoading}
          onReload={fetchData}
        />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={handleClose} sx={{ overflowY: 'auto' }}>
        <FormComponent onClose={handleClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default SettingsView;
