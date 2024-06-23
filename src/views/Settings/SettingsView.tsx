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
  TextField,
  Typography,
  Button,
  TableSortLabel,
} from '@mui/material';
import { SettingNamesType } from '@/types/SettingsTypes';
import { SubdirectoryArrowRight } from '@mui/icons-material';
import { databaseRequest, SettingsConfig } from '@/utils';
import { TableResponseType } from '@/types/TableTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import EditSettings from './EditSettings';
import DeleteSettings from './DeleteSettings';
import { grey } from '@mui/material/colors';
import { AppIcon } from '@/components';

const GET_LIMIT = () => Math.max(Math.floor((window.innerHeight - 200) / 55) - 1 || 10, 1);

/** * Renders default "Settings" view
 * urls: /settings/boxes, /settings/ideas, /settings/rooms, /settings/messages, /settings/users
 */
const SettingsView = () => {
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const [items, setItems] = useState<TableResponseType>();
  const [limit, setLimit] = useState(GET_LIMIT());
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(SettingsConfig[setting_name].rows[0]['id']);
  const [orderAsc, setOrderAsc] = useState(true);

  const [selected, setSelected] = useState([] as number[]);
  const [openDelete, setOpenDelete] = useState(false);

  const dataFetch = async () => {
    resetTable();
    await databaseRequest('model', {
      model: SettingsConfig[setting_name].model,
      method: SettingsConfig[setting_name].requests.fetch,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: orderAsc,
      },
    }).then((response: TableResponseType) => {
      setItems(response);
    });
  };

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
      setLimit(GET_LIMIT());
      setOrder(SettingsConfig[setting_name].rows[0]['id']);
    }
  };

  const handleWindowSizeChange = () => setLimit(GET_LIMIT());

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderAsc, setting_id, setting_name]);

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" sx={{ p: 2, textTransform: 'capitalize', flex: 1 }}>
          {SettingsConfig[setting_name].name}
        </Typography>
        <Stack direction="row" alignItems="start" bottom={0} height={37} px={2} flex={1}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AppIcon name="search" />
                </InputAdornment>
              ),
            }}
            variant="standard"
            color="secondary"
            size="small"
            sx={{ px: 1 }}
          />
        </Stack>
      </Stack>
      <Divider />
      <Stack flexGrow={1} sx={{ overflowX: 'auto' }}>
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
                    {column.displayName}
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
      <Stack direction="row" justifyContent="space-between" bottom={0} height={37} bgcolor={grey[200]} px={1}>
        {selected.length > 0 && (
          <>
            <Stack direction="row" alignItems="center" flex={1}>
              <SubdirectoryArrowRight sx={{ ml: 3, fontSize: '1rem' }} color="secondary" />
              <Button disabled={selected.length === 0} color="secondary" onClick={() => setOpenDelete(true)}>
                <AppIcon sx={{ mr: 1 }} name="delete" /> Delete
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="end" flex={1}>
              {SettingsConfig[setting_name].isChild && (
                <Button disabled={selected.length === 0} color="secondary" onClick={() => setOpenDelete(true)}>
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
        onClick={() => navigate('new')}
      >
        <AppIcon name="add" />
      </Fab>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="center" bottom={0} height={48}>
        {items && items.count && (
          <Pagination count={Math.ceil(Number(items.count) / limit)} onChange={changePage} sx={{ py: 1 }} />
        )}
      </Stack>
      <EditSettings key={`${setting_name}_${setting_id || 'new'}`} />
      <DeleteSettings
        key={`${setting_name}`}
        items={selected}
        isOpen={openDelete}
        closeMethod={() => setOpenDelete(false)}
        reloadMethod={() => dataFetch()}
      />
    </Stack>
  );
};

export default SettingsView;
