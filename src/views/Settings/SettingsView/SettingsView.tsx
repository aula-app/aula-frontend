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

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [isLoading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState<Array<Record<keyof PossibleFields, string>>>([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(DataConfig[setting_name].columns[0].orderId);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [status, setStatus] = useState<StatusTypes>(-1);
  const [role, setRole] = useState<RoleTypes | -1>(-1);
  const [target, setTarget] = useState(0);

  const [selected, setSelected] = useState<number[]>([]);
  const [editId, setEditId] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const dataFetch = async () => {
    setLoading(true);
    const requestId = [];
    if (setting_name === 'ideas' || setting_name === 'boxes') requestId.push('use_id');

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

    if (target > 0) {
      requestData.method = 'getUsersByRoom';
      requestData.arguments.room_id = target;
    }

    if (setting_name === 'users' && role > 0) {
      requestData.arguments.userlevel = role;
    }

    if (!filter.includes('')) {
      requestData['arguments']['search_field'] = filter[0];
      requestData['arguments']['search_text'] = filter[1];
    }

    await databaseRequest(requestData, requestId).then((response) => {
      setLoading(false);
      if (!response.success) return;
      setItems(response.data || []);
      setPageCount(response.count);
    });
  };

  const setEdit = (id: number) => {
    if (id === 0) return;
    setEditId(id);
    setOpenEdit(true);
  };

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

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

  const onClose = () => {
    dataFetch();
    setOpenEdit(false);
    setOpenDelete(false);
  };

  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name, filter, status, role, target]);

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
      ) : (
        <DataTableSkeleton />
      )}
      <Divider />
      {pageCount && <PaginationBar pages={Math.ceil(Number(pageCount) / limit)} setPage={setPage} />}

      <EditData key={`${setting_name}`} isOpen={openEdit} id={editId} scope={setting_name} onClose={onClose} />
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
            setEditId(0);
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
