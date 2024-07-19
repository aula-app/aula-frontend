import { AppIcon, AppIconButton } from '@/components';
import AlterData from '@/components/AlterData';
import DeleteData from '@/components/DeleteData';
import { SettingNamesType } from '@/types/SettingsTypes';
import { TableResponseType } from '@/types/TableTypes';
import { databaseRequest, dataSettings, getRequest, requestDefinitions } from '@/utils';
import { SubdirectoryArrowRight } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Fab,
  FilledInput,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MoveSettings from './MoveSettings';

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [items, setItems] = useState<TableResponseType>();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(dataSettings[setting_name][0].orderId);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState(['', '']);

  const [selected, setSelected] = useState<number[]>([]);
  const [alter, setAlter] = useState<{ open: boolean; id?: number }>({ open: false });
  const [openDelete, setOpenDelete] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const tableBody = useRef<HTMLTableSectionElement | null>(null);

  const dataFetch = async (filter: string) =>
    await databaseRequest({
      model: requestDefinitions[setting_name].model,
      method: getRequest(setting_name, 'fetch'),
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
        extra_where: filter,
      },
    });

  const loadData = async () => {
    getLimit();
    const currentFilter = !filter.includes('') ? ` AND ${filter[0]} LIKE '%${filter[1]}%'` : '';
    await dataFetch(currentFilter).then((response) => setItems(response));
  };

  const getLimit = () => {
    setLimit(
      tableBody && tableBody.current ? Math.max(Math.floor(tableBody.current.clientHeight / 55) - 1 || 10, 1) : 10
    );
  };

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  const changeFilter = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([event.target.value, filter[1]]);
  };
  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  const toggleRow = (id: number) => {
    selected.includes(id) ? setSelected(selected.filter((value) => value !== id)) : setSelected([...selected, id]);
  };

  const toggleAllRows = () => {
    if (!items || !items.data) return;
    const allIds = Object.entries(items.data).map(([, item]) => item.id);
    selected.length > 0 ? setSelected([]) : setSelected(allIds);
  };

  const resetTable = () => {
    if (!requestDefinitions[setting_name]) {
      navigate('/error');
    } else {
      setPage(0);
      setSelected([]);
      setOrderAsc(true);
      getLimit();
      setOrder(dataSettings[setting_name][0].orderId);
    }
  };

  const handleWindowSizeChange = () => getLimit();

  const onClose = () => {
    loadData();
    setAlter({ open: false });
    setOpenDelete(false);
    setOpenMove(false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name, filter]);

  useEffect(() => {
    resetTable();
  }, [setting_id, setting_name]);

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" sx={{ p: 2, textTransform: 'capitalize', flex: 1 }}>
          {t(`views.${setting_name}`)}
        </Typography>
        <Stack direction="row" alignItems="start" bottom={0} height={37} px={2}>
          <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />
        </Stack>
      </Stack>
      <Collapse in={openFilter}>
        <Stack direction="row" alignItems="center" p={2} pt={0}>
          <TextField
            select
            label="Column"
            value={filter[0]}
            onChange={changeFilter}
            variant="filled"
            size="small"
            sx={{ width: 100, mr: 1 }}
          >
            <MenuItem value=""></MenuItem>
            {dataSettings[setting_name].map((column) => (
              <MenuItem value={column.name} key={column.name}>
                {t(`settings.${column.name}`)}
              </MenuItem>
            ))}
          </TextField>
          <FilledInput
            size="small"
            onChange={changeSearch}
            value={filter[1]}
            endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
          />
        </Stack>
      </Collapse>
      <Divider />
      <Stack flexGrow={1} sx={{ overflowX: 'auto' }} ref={tableBody}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {items && items.data && (
                <TableCell>
                  <Checkbox
                    onChange={toggleAllRows}
                    checked={selected.length === items.data.length}
                    indeterminate={selected.length > 0 && selected.length < items.data.length}
                    color="secondary"
                  />
                </TableCell>
              )}
              {dataSettings[setting_name].map((column, key) => (
                <TableCell key={`${column}${key}`} sx={{ whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === dataSettings[setting_name][key].orderId}
                    direction={orderAsc ? 'asc' : 'desc'}
                    onClick={() => handleOrder(dataSettings[setting_name][key].orderId)}
                  >
                    {t(`settings.${column.name}`)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {items && items.data && (
            <TableBody>
              {items.data.map((row) => (
                <TableRow key={row.id} sx={{ background: selected.includes(row.id) ? grey[200] : '' }}>
                  <TableCell>
                    <Checkbox checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
                  </TableCell>
                  {dataSettings[setting_name].map((column) => (
                    <TableCell
                      key={`${column}-${row.id}`}
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onClick={() => setAlter({ open: true, id: row.id })}
                    >
                      {row[column.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </Stack>
      <Stack direction="row" justifyContent="space-between" bottom={0} height={37} bgcolor={grey[200]} px={1}>
        {selected.length > 0 && (
          <>
            <Stack direction="row" alignItems="center" flex={1}>
              <SubdirectoryArrowRight sx={{ ml: 3, fontSize: '1rem' }} color="secondary" />
              <Button disabled={selected.length === 0} color="secondary" onClick={() => setOpenDelete(true)}>
                <AppIcon sx={{ mr: 1 }} icon="delete" /> {t('generics.delete')}
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="end" flex={1}>
              {requestDefinitions[setting_name].isChild && (
                <Button disabled={selected.length === 0} color="secondary" onClick={() => setOpenMove(true)}>
                  <AppIcon
                    sx={{ mr: 1 }}
                    icon={
                      requestDefinitions[requestDefinitions[setting_name].isChild].model === 'Topic'
                        ? 'box'
                        : requestDefinitions[requestDefinitions[setting_name].isChild].model.toLowerCase()
                    }
                  />{' '}
                  {t('texts.addToParent', {
                    var:
                      requestDefinitions[setting_name].isChild === 'boxes'
                        ? 'box'
                        : requestDefinitions[requestDefinitions[setting_name].isChild].model.toLowerCase(),
                  })}
                </Button>
              )}
            </Stack>
          </>
        )}
      </Stack>
      <Fab
        aria-label="add"
        color="primary"
        sx={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: 40,
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
        }}
        onClick={() => setAlter({ open: true })}
      >
        <AppIcon icon="add" />
      </Fab>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="center" bottom={0} height={48}>
        {items && items.count && (
          <Pagination count={Math.ceil(Number(items.count) / limit)} onChange={changePage} sx={{ py: 1 }} />
        )}
      </Stack>
      <AlterData key={`${setting_name}`} isOpen={alter.open} id={alter.id} scope={setting_name} onClose={onClose} />
      <DeleteData key={`d_${setting_name}`} isOpen={openDelete} id={selected} scope={setting_name} onClose={onClose} />
      <MoveSettings key={`m_${setting_name}`} items={selected} isOpen={openMove} onClose={onClose} />
    </Stack>
  );
};

export default SettingsView;
