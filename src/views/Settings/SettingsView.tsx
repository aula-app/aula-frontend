import { useNavigate, useParams } from 'react-router-dom';
import {
  Checkbox,
  Divider,
  Fab,
  InputAdornment,
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
  Button,
} from '@mui/material';
import { NotFoundView } from '..';
import Tables from '@/utils/tables.json';
import { SettingNamesType } from '@/types/SettingsTypes';
import { Add, Delete, Inbox, Search, SubdirectoryArrowLeft } from '@mui/icons-material';
import { databaseRequest } from '@/utils/requests';
import { TableResponseType } from '@/types/TableTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import EditSettings from './EditSettings';
import DeleteSettings from './DeleteSettings';
import { grey } from '@mui/material/colors';

const GET_LIMIT = () => Math.floor((window.innerHeight - 200) / 55) - 1 || 10

/** * Renders default "Settings" view
 * urls: /settings/groups, /settings/ideas, /settings/rooms, /settings/texts, /settings/users
 */
const SettingsView = () => {
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [items, setItems] = useState({} as TableResponseType);
  const [limit, setLimit] = useState(GET_LIMIT());
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(Tables[setting_name].rows[0]['id']);
  const [orderAsc, setOrderAsc] = useState(true);

  const [selected, setSelected] = useState([] as number[]);
  const [openDelete, setOpenDelete] = useState(false);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: Tables[setting_name].model,
      method: Tables[setting_name].method,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
      },
      decrypt: Tables[setting_name].rows.filter((row) => row.encryption).map((value) => value.name),
    }).then((response: TableResponseType) => {
      setItems(response);
    });

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  const toggleRow = (id: number) => {
    selected.includes(id) ? setSelected(selected.filter((value) => value !== id)) : setSelected([...selected, id]);
  };

  const toggleAllRows = () => {
    if (!items.data) return;
    const allIds = Object.entries(items.data).map(([, item]) => item.id);
    selected.length > 0 ? setSelected([]) : setSelected(allIds);
  };

  const resetTable = () => {
    if (!Tables[setting_name]) {
      navigate('/error');
    } else {
      setPage(0);
      setSelected([]);
      setOrderAsc(true);
      setLimit(GET_LIMIT());
      setOrder(Tables[setting_name].rows[0]['id']);
    }
  };

  const handleWindowSizeChange = () => setLimit(GET_LIMIT());

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    };
}, []);
  useEffect(resetTable, [setting_name]);
  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderAsc, setting_id]);

  return items ? (
    <Stack direction="column" height="100%">
      <Fab
        aria-label="add"
        color="primary"
        sx={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}
        onClick={() => navigate('new')}
      >
        <Add />
      </Fab>
      <Typography variant="h4" sx={{ p: 2, pb: 0, textTransform: 'capitalize' }}>
        {setting_name}
      </Typography>
      {selected.length > 0 ? (
        <Stack direction="row" alignItems="center" bottom={0} height={37} bgcolor={grey[200]}>
          <SubdirectoryArrowLeft sx={{ transform: 'rotate(180deg)', ml: 4, fontSize: '1rem', mt: 1 }} />
          {setting_name === 'ideas' &&
          <Button disabled={selected.length === 0} color='secondary' onClick={() => setOpenDelete(true)} sx={{mx: 2}}>
            <Inbox />Create new Box
          </Button>
          }
          <Button disabled={selected.length === 0} color='secondary' onClick={() => setOpenDelete(true)} sx={{mx: 2, ml: 'auto'}}>
            <Delete /> Delete
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="start" bottom={0} height={37} px={2}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="standard"
            color="secondary"
            size="small"
            sx={{ px: 1 }}
          />
        </Stack>
      )}
      <Divider />
      <Stack flexGrow={1} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {items.data && (
                <TableCell>
                  <Checkbox
                    onChange={toggleAllRows}
                    checked={selected.length === items.data.length}
                    indeterminate={selected.length > 0 && selected.length < items.data.length}
                    color="secondary"
                  />
                </TableCell>
              )}
              {Tables[setting_name].rows.map((column, key) => (
                <TableCell key={`${column.name}${key}`} sx={{ whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderAsc ? 'asc' : 'desc'}
                    onClick={() => handleOrder(column.id)}
                  >
                    {column.displayName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {items.data && (
            <TableBody>
              {items.data.map((row) => (
                <TableRow key={row.id} sx={{ background: selected.includes(row.id) ? grey[200] : '' }}>
                  <TableCell>
                    <Checkbox checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
                  </TableCell>
                  {Tables[setting_name].rows.map((column) => (
                    <TableCell
                      key={`${column.name}-${row.id}`}
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onClick={() => navigate(`/settings/${setting_name}/${row.id}`)}
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
      <Divider />
      <Stack direction="row" justifyContent="center" bottom={0}>
        {items.count && (
          <Pagination count={Math.ceil(Number(items.count) / limit)} onChange={changePage} sx={{ py: 1 }} />
        )}
      </Stack>
      <EditSettings />
      <DeleteSettings
        items={selected}
        isOpen={openDelete}
        closeMethod={() => setOpenDelete(false)}
        reloadMethod={() => dataFetch()}
      />
    </Stack>
  ) : (
    <NotFoundView />
  );
};

export default SettingsView;
