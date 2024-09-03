import { AppIconButton } from '@/components';
import { EditData, DeleteData } from '@/components/Data';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, dataSettings, scopeDefinitions } from '@/utils';
import { Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MoveSettings from '../MoveSettings';
import DataTable from './DataTable';
import EditBar from './EditBar';
import FilterBar from './FilterBar';
import PaginationBar from './PaginationBar';
import { PossibleFields } from '@/types/Scopes';

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [activeItems, setActiveItems] = useState<PossibleFields[]>([]);
  const [suspendedItems, setSuspendedItems] = useState<PossibleFields[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(dataSettings[setting_name][0].orderId);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState<[string, string]>(['', '']);

  const [selected, setSelected] = useState<number[]>([]);
  const [alter, setAlter] = useState<{ open: boolean; id?: number }>({ open: false });
  const [openDelete, setOpenDelete] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const dataFetch = async (filter: string, status: 0 | 1) =>
    await databaseRequest({
      model: scopeDefinitions[setting_name].model,
      method: scopeDefinitions[setting_name].fetch,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
        extra_where: filter,
        status: status,
      },
    });

  const loadData = async () => {
    const currentFilter = !filter.includes('') ? ` AND ${filter[0]} LIKE '%${filter[1]}%'` : '';
    await dataFetch(currentFilter, 1).then((response) => {
      if (response.success) setActiveItems(response.data || []);
    });
    await dataFetch(currentFilter, 0).then((response) => {
      if (response.success) setSuspendedItems(response.data || []);
    });
  };

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  const resetTable = () => {
    if (!scopeDefinitions[setting_name]) {
      navigate('/error');
    } else {
      setPage(0);
      setSelected([]);
      setOrderAsc(true);
      setOrder(dataSettings[setting_name][0].orderId);
    }
  };

  const onClose = () => {
    loadData();
    setAlter({ open: false });
    setOpenDelete(false);
    setOpenMove(false);
  };

  useEffect(() => {
    loadData();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name, filter]);

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
      <FilterBar scope={setting_name} filter={filter} setFilter={setFilter} isOpen={openFilter} />
      <Divider />
      {activeItems && suspendedItems ? (
        <DataTable
          handleOrder={handleOrder}
          activeItems={activeItems}
          suspendedItems={suspendedItems}
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
      {activeItems && suspendedItems && (
        <PaginationBar
          pages={Math.ceil(Number([...activeItems, ...suspendedItems].length) / limit)}
          setPage={setPage}
        />
      )}
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
