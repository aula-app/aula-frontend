import { AppIconButton } from '@/components';
import { DeleteData, EditData } from '@/components/Data';
import DataTable from '@/components/Data/DataTable';
import EditBar from '@/components/Data/DataTable/EditBar';
import PaginationBar from '@/components/Data/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { RoleTypes, SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, RequestObject } from '@/utils';
import { statusOptions } from '@/utils/commands';
import DataConfig from '@/utils/Data';
import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MoveSettings from '../MoveSettings';

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [isLoading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState<PossibleFields[]>([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(DataConfig[setting_name].columns[0].orderId);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [status, setStatus] = useState<StatusTypes>(-1);
  const [role, setRole] = useState<RoleTypes | -1>(-1);
  const [target, setTarget] = useState(0);

  const [selected, setSelected] = useState<number[]>([]);
  const [alter, setAlter] = useState<{ open: boolean; id?: number }>({ open: false });
  const [openDelete, setOpenDelete] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const dataFetch = async () => {
    setLoading(true);
    const requestId = [];
    if (setting_name === 'ideas' || setting_name === 'boxes') requestId.push('user_id');

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
    setAlter({ open: false });
    setOpenDelete(false);
    setOpenMove(false);
  };

  useEffect(() => {
    console.log('aqui');
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
          handleOrder={handleOrder}
          items={items}
          orderAsc={orderAsc}
          orderBy={orderBy}
          scope={setting_name}
          selected={selected}
          setAlter={setAlter}
          setLimit={setLimit}
          setSelected={setSelected}
        />
      ) : (
        <Stack flex={1}>
          <Divider />
          <Stack direction="row" height={56} justifyContent="space-around" alignItems="center">
            <Skeleton variant="text" width={20} height={30} />
            {[...Array(7)].map(() => (
              <Skeleton variant="text" width="10%" height={30} />
            ))}
          </Stack>
          <Divider />
          {[...Array(7)].map(() => (
            <Skeleton variant="rectangular" height={42} sx={{ mt: 0.5 }} />
          ))}
        </Stack>
      )}
      <EditBar
        scope={setting_name}
        selected={selected}
        onAlter={setAlter}
        onMove={setOpenMove}
        onDelete={setOpenDelete}
      />
      <Divider />
      {pageCount && <PaginationBar pages={Math.ceil(Number(pageCount) / limit)} setPage={setPage} />}
      <EditData key={`${setting_name}`} isOpen={alter.open} id={alter.id} scope={setting_name} onClose={onClose} />
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
      <MoveSettings key={`m${setting_name}`} items={selected} isOpen={openMove} onClose={onClose} />
    </Stack>
  );
};

export default SettingsView;
