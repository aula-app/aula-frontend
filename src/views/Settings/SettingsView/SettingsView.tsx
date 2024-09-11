import { AppIconButton } from '@/components';
import { DeleteData, EditData } from '@/components/Data';
import { useAppStore } from '@/store';
import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { TableResponseType } from '@/types/TableTypes';
import { databaseRequest } from '@/utils';
import { Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MoveSettings from '../MoveSettings';
import DataTable from './DataTable';
import EditBar from './EditBar';
import FilterBar from './FilterBar';
import PaginationBar from './PaginationBar';
import { STATUS } from '@/utils/Data/formDefaults';
import DataConfig from '@/utils/Data';

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [, dispatch] = useAppStore();

  const [items, setItems] = useState<TableResponseType>();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(DataConfig[setting_name].columns[0].orderId);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [status, setStatus] = useState<StatusTypes>(1);

  const [selected, setSelected] = useState<number[]>([]);
  const [alter, setAlter] = useState<{ open: boolean; id?: number }>({ open: false });
  const [openDelete, setOpenDelete] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];

  const dataFetch = async () =>
    await databaseRequest({
      model: DataConfig[setting_name].requests.model,
      method: DataConfig[setting_name].requests.fetch,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
        status: status,
        extra_where: getFilter(),
      },
    }).then((response) => {
      response.success
        ? setItems(response)
        : dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
    });

  const getFilter = () => (!filter.includes('') ? ` AND ${filter[0]} LIKE '%${filter[1]}%'` : '');

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  const resetTable = () => {
    if (!DataConfig[setting_name]) {
      navigate('/error');
    } else {
      setPage(0);
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
    dataFetch();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name, filter, status]);

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
          <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />
        </Stack>
      </Stack>
      <FilterBar
        scope={setting_name}
        filter={filter}
        statusOptions={statusOptions}
        status={status}
        setFilter={setFilter}
        setStatus={setStatus}
        isOpen={openFilter}
      />
      <Divider />
      {items && items.data ? (
        <DataTable
          handleOrder={handleOrder}
          items={items.data}
          orderAsc={orderAsc}
          orderBy={orderBy}
          scope={setting_name}
          selected={selected}
          setAlter={setAlter}
          setLimit={setLimit}
          setSelected={setSelected}
        />
      ) : (
        <Stack flex={1}></Stack>
      )}
      <EditBar
        scope={setting_name}
        selected={selected}
        onAlter={setAlter}
        onMove={setOpenMove}
        onDelete={setOpenDelete}
      />
      <Divider />
      {items && items.data && <PaginationBar pages={Math.ceil(Number(items.count) / limit)} setPage={setPage} />}
      <EditData key={`${setting_name}`} isOpen={alter.open} id={alter.id} scope={setting_name} onClose={onClose} />
      <DeleteData
        key={`d_${setting_name}`}
        isOpen={openDelete}
        id={selected}
        scope={setting_name}
        onClose={() => {
          onClose();
          setSelected([]);
        }}
      />
      <MoveSettings key={`m_${setting_name}`} items={selected} isOpen={openMove} onClose={onClose} />
    </Stack>
  );
};

export default SettingsView;
