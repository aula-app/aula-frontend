import { AppIcon, AppIconButton } from '@/components';
import { DeleteData, EditData } from '@/components/Data';
import DataTable from '@/components/Data/DataTable';
import DataTableSkeleton from '@/components/Data/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/Data/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { RoleTypes, SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, RequestObject } from '@/utils';
import { statusOptions } from '@/utils/commands';
import DataConfig from '@/utils/Data';
import { Divider, Fab, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * SettingsView Component
 * Renders a configurable settings view for different entities (boxes, ideas, rooms, messages, users)
 * Supports features like pagination, filtering, sorting, and CRUD operations
 * URLs: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Extract setting name and ID from URL parameters
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  // Loading and data states
  const [isLoading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState<Array<Record<keyof PossibleFields, string>>>([]);

  // Pagination and sorting states
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(0); // Current page number
  const [orderBy, setOrder] = useState(DataConfig[setting_name].columns[0].orderId); // Column to sort by
  const [orderAsc, setOrderAsc] = useState(true); // Sort direction (ascending/descending)

  // Filtering states
  const [filter, setFilter] = useState<[string, string]>(['', '']); // [field, value] for text filtering
  const [status, setStatus] = useState<StatusTypes>(-1); // Status filter
  const [role, setRole] = useState<RoleTypes | -1>(-1); // Role filter (for users)
  const [target, setTarget] = useState(0); // Target filter (e.g., room_id)

  // UI control states
  const [selected, setSelected] = useState<number[]>([]); // Selected items for bulk operations
  const [editItem, setEditItem] = useState<Record<keyof PossibleFields, string>>(); // Item being edited
  const [openEdit, setOpenEdit] = useState(false); // Edit dialog visibility
  const [openDelete, setOpenDelete] = useState(false); // Delete dialog visibility
  const [openFilter, setOpenFilter] = useState(false); // Filter bar visibility

  /**
   * Fetches data from the server based on current filters, pagination, and sorting
   * Updates items array and total count
   */
  const dataFetch = async () => {
    setLoading(true);
    const requestId = [];
    if (setting_name === 'ideas' || setting_name === 'boxes') requestId.push('user_id');

    // Construct request object with current filters and pagination
    const requestData = {
      model: DataConfig[setting_name].requests.model,
      method: DataConfig[setting_name].requests.fetch,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
        status: status,
      },
    } as RequestObject;

    // Add room-specific filtering
    if (target > 0) {
      if (setting_name === 'users') requestData.method = 'getUsersByRoom';
      requestData.arguments.room_id = target;
    }

    // Add user role filtering
    if (setting_name === 'users' && role > 0) {
      requestData.arguments.userlevel = role;
    }

    // Add text search filtering
    if (!filter.includes('')) {
      requestData['arguments']['search_field'] = filter[0];
      requestData['arguments']['search_text'] = filter[1];
    }

    // Execute request and update state
    await databaseRequest(requestData, requestId).then((response) => {
      setLoading(false);
      if (!response.success || !response.data) return;
      setItems(response.data || []);
      setPageCount(response.count);
    });
  };

  /**
   * Opens the edit dialog for a specific item
   * @param id - ID of the item to edit
   */
  const setEdit = (item: Record<keyof PossibleFields, string>) => {
    if (item.id === '0') return;
    setEditItem(item);
    setOpenEdit(true);
  };

  /**
   * Handles column header clicks for sorting
   * @param col - Column ID to sort by
   */
  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  /**
   * Resets table state to default values
   * Called when switching between different setting types
   */
  const resetTable = () => {
    if (!DataConfig[setting_name]) {
      navigate('/error');
    } else {
      setItems([]);
      setPage(0);
      setTarget(0);
      setSelected([]);
      setOrderAsc(true);
      setOrder(DataConfig[setting_name].columns[0].orderId);
    }
  };

  /**
   * Handles dialog close events
   * Refreshes data after edit/delete operations
   */
  const onClose = () => {
    dataFetch();
    setOpenEdit(false);
    setOpenDelete(false);
  };

  // Fetch data when filters, pagination, or sorting changes
  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name, filter, status, role, target]);

  // Reset table when switching between different setting types
  useEffect(() => {
    resetTable();
  }, [setting_id, setting_name]);

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
          {t(`views.${setting_name}`)}
        </Typography>
        <Stack direction="row" alignItems="start" bottom={0} height={37} px={2}>
          {items.length > 0 && <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />}
        </Stack>
      </Stack>
      <FilterBar
        scope={setting_name}
        filter={filter}
        role={role}
        target={target}
        statusOptions={statusOptions}
        status={status}
        setRole={setRole}
        setTarget={setTarget}
        setFilter={setFilter}
        setStatus={setStatus}
        isOpen={openFilter}
      />
      <Divider />
      {!isLoading ? (
        <>
          {items.length > 0 && (
            <DataTable
              columns={DataConfig[setting_name].columns}
              rows={items}
              selected={selected}
              onSelect={setSelected}
              onClick={setEdit}
              handleOrder={handleOrder}
              orderAsc={orderAsc}
              orderBy={orderBy}
              setLimit={setLimit}
            />
          )}
        </>
      ) : (
        <DataTableSkeleton />
      )}
      <Divider />
      {typeof pageCount === 'number' && (
        <PaginationBar pages={Math.ceil(Number(pageCount) / limit)} setPage={setPage} />
      )}

      {/* Edit Dialog */}
      <EditData key={`${setting_name}`} isOpen={openEdit} item={editItem} scope={setting_name} onClose={onClose} />

      {/* Delete Dialog */}
      <DeleteData
        key={`d${setting_name}`}
        isOpen={openDelete}
        id={selected}
        scope={setting_name}
        onClose={() => {
          onClose();
          setSelected([]);
        }}
      />

      {/* Floating Action Button - switches between delete and add based on selection */}
      {selected.length > 0 ? (
        <Fab
          aria-label="delete"
          color="error"
          onClick={() => setOpenDelete(true)}
          sx={{
            position: 'fixed',
            bottom: 40,
            alignSelf: 'center',
          }}
        >
          <AppIcon icon="delete" />
        </Fab>
      ) : (
        <Fab
          aria-label="add"
          color="primary"
          onClick={() => {
            setEditItem(undefined);
            setOpenEdit(true);
          }}
          sx={{
            position: 'fixed',
            bottom: 40,
            alignSelf: 'center',
          }}
        >
          <AppIcon icon="add" />
        </Fab>
      )}
    </Stack>
  );
};

export default SettingsView;
