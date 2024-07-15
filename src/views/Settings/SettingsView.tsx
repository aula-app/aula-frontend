import { useNavigate, useParams } from 'react-router-dom';
import {
  Checkbox,
  Divider,
  Fab,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  TableSortLabel,
  Collapse,
  FilledInput,
} from '@mui/material';
import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { SubdirectoryArrowRight } from '@mui/icons-material';
import { databaseRequest, SettingsConfig } from '@/utils';
import { TableResponseType } from '@/types/TableTypes';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import DeleteSettings from './DeleteSettings';
import { grey } from '@mui/material/colors';
import { AppIcon, AppIconButton } from '@/components';
import MoveSettings from './MoveSettings';
import { useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';

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
  const [orderBy, setOrder] = useState(SettingsConfig[setting_name].rows[0]['id']);
  const [orderAsc, setOrderAsc] = useState(true);
  const [filter, setFilter] = useState(['', '']);

  const [selected, setSelected] = useState<number[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const tableBody = useRef<HTMLTableSectionElement | null>(null);

  const dataFetch = async (filter: string) =>
    await databaseRequest({
      model: SettingsConfig[setting_name].model,
      method: SettingsConfig[setting_name].requests.fetch,
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
    if (!SettingsConfig[setting_name]) {
      navigate('/error');
    } else {
      setPage(0);
      setSelected([]);
      setOrderAsc(true);
      getLimit();
      setOrder(SettingsConfig[setting_name].rows[0]['id']);
    }
  };

  const handleWindowSizeChange = () => getLimit();

  const onDelete = () => {
    setOpenDelete(false);
    setSelected([]);
  };

  const onMove = () => {
    setOpenMove(false);
    setSelected([]);
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
          {t(`views.${SettingsConfig[setting_name].name}`)}
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
            {SettingsConfig[setting_name].rows.map((column) => (
              <MenuItem value={column.name} key={column.name}>
                {column.displayName}
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
              {SettingsConfig[setting_name].rows.map((column, key) => (
                <TableCell key={`${column.name}${key}`} sx={{ whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderAsc ? 'asc' : 'desc'}
                    onClick={() => handleOrder(column.id)}
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
                  {SettingsConfig[setting_name].rows.map((column) => (
                    <TableCell
                      key={`${column.name}-${row.id}`}
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onClick={() =>
                        dispatch({
                          type: 'EDIT_DATA',
                          payload: { type: 'edit', element: setting_name, id: row.id, onClose: loadData },
                        })
                      }
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
                <AppIcon sx={{ mr: 1 }} name="delete" /> {t('generics.delete')}
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="end" flex={1}>
              {SettingsConfig[setting_name].isChild && (
                <Button disabled={selected.length === 0} color="secondary" onClick={() => setOpenMove(true)}>
                  <AppIcon sx={{ mr: 1 }} name={SettingsConfig[SettingsConfig[setting_name].isChild].item} /> Add to{' '}
                  {SettingsConfig[SettingsConfig[setting_name].isChild].item}
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
        onClick={() =>
          dispatch({ type: 'EDIT_DATA', payload: { type: 'add', element: setting_name, id: 0, onClose: loadData } })
        }
      >
        <AppIcon name="add" />
      </Fab>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="center" bottom={0} height={48}>
        {items && items.count && (
          <Pagination count={Math.ceil(Number(items.count) / limit)} onChange={changePage} sx={{ py: 1 }} />
        )}
      </Stack>
      <DeleteSettings
        key={`${setting_name}`}
        items={selected}
        isOpen={openDelete}
        closeMethod={onDelete}
        reloadMethod={() => loadData()}
      />
      <MoveSettings
        key={`move_${setting_name}`}
        items={selected}
        isOpen={openMove}
        closeMethod={onMove}
        reloadMethod={() => loadData()}
      />
    </Stack>
  );
};

export default SettingsView;
