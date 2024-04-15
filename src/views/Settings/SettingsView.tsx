import { useNavigate, useParams } from 'react-router-dom';
import {
  Drawer,
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
} from '@mui/material';
import UsersView from './Users';
import GroupsView from './Groups';
import IdeasView from './Ideas';
import RoomsView from './Rooms';
import TextsView from './Texts';
import { NotFoundView } from '..';
import Tables from '@/utils/tables.json';
import { SettingsType } from '@/types/SettingsTypes';
import { Add, Search } from '@mui/icons-material';
import { databaseRequest } from '@/utils/requests';
import { TableResponseType } from '@/types/TableTypes';
import { ChangeEvent, useEffect, useState } from 'react';

const DEFAULT_LIMIT = Math.floor((window.innerWidth - 220) / 34) || 10;

/** * Renders default "Settings" view
 * urls: /settings/groups, /settings/ideas, /settings/rooms, /settings/texts, /settings/users
 */
const SettingsView = () => {
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingsType };
  const pages = {
    groups: <GroupsView />,
    ideas: <IdeasView />,
    rooms: <RoomsView />,
    texts: <TextsView />,
    users: <UsersView />,
  };

  const [items, setItems] = useState({} as TableResponseType);
  // const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [page, setPage] = useState(0);
  const [orderBy, setOrder] = useState(0);
  const [orderAsc, setOrderAsc] = useState(true);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: Tables[setting_name].model,
      method: Tables[setting_name].method,
      arguments: {
        limit: DEFAULT_LIMIT,
        offset: page * DEFAULT_LIMIT,
        orderby: Tables[setting_name].rows[0]['id'],
        asc: Number(true),
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

  const resetTable = () => {
    if (!Object.keys(pages).includes(setting_name)) {
      navigate('/error');
    } else {
      setPage(0);
      setOrderAsc(true);
      setOrder(Tables[setting_name].rows[0]['id']);
    }
  };

  useEffect(resetTable, [setting_name]);
  useEffect(() => {
    dataFetch();
  }, [page, orderBy, orderAsc]);

  return items ? (
    <Stack direction="column" height="100%">
      <Fab aria-label="add" color="primary" sx={{ position: 'absolute', bottom: 60, right: 20 }}>
        <Add />
      </Fab>
      <Typography variant="h4" sx={{ p: 2, pb: 0, textTransform: 'capitalize' }}>
        {setting_name}
      </Typography>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        variant="standard"
        sx={{ px: 2 }}
      />
      <Table stickyHeader size="small" sx={{ flexGrow: 1 }}>
        <TableHead>
          <TableRow>
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
        {items && items.data && (
          <TableBody>
            {items.data.map((row) => (
              <TableRow key={row.id}>
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
      <Stack direction="row" justifyContent="center">
        {items && items.count && (
          <Pagination count={Math.ceil(Number(items.count) / DEFAULT_LIMIT)} sx={{ py: 1 }} onChange={changePage} />
        )}
      </Stack>
      <Drawer anchor="bottom" open={Boolean(setting_id)} onClose={() => navigate(`/settings/${setting_name}`)}>
        {pages[setting_name]}
      </Drawer>
    </Stack>
  ) : (
    <NotFoundView />
  );
};

export default SettingsView;
