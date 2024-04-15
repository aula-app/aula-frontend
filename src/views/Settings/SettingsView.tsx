import { useParams } from 'react-router-dom';
import {
  Fab,
  InputAdornment,
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
import { TableOptions, TableResponseType } from '@/types/TableTypes';
import { useEffect, useState } from 'react';

const DEFAULT_LIMIT = Math.floor((window.screen.height - 220) / 34) || 10;

/** * Renders default "Settings" view
 * urls: /settings/groups, /settings/ideas, /settings/rooms, /settings/texts, /settings/users
 */
const SettingsView = () => {
  const pages = {
    groups: <GroupsView />,
    ideas: <IdeasView />,
    rooms: <RoomsView />,
    texts: <TextsView />,
    users: <UsersView />,
  };

  const { setting_name } = useParams() as { setting_name: SettingsType };
  const isSettings = (param: SettingsType) => Object.keys(pages).includes(param);
  const options = Tables[setting_name] as TableOptions;
  const columns = options.rows.map((value) => value.name);
  const decrypt = columns.filter((column, key) => options.rows[key].encryption);

  const [items, setItems] = useState({} as TableResponseType);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [orderBy, setOrder] = useState(options.rows[0]['id']);
  const [orderAsc, setOrderAsc] = useState(true);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: options.model,
      method: options.method,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: Number(orderAsc),
      },
      decrypt: decrypt,
    }).then((response: TableResponseType) => {
      setItems(response);
    });

  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderAsc]);

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderAsc(!orderAsc);
    setOrder(col);
  };

  return isSettings(setting_name) ? (
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
      {/* <ItemsTable items={items.data} /> */}
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, key) => (
              <TableCell key={column} sx={{ whiteSpace: 'nowrap' }}>
                <TableSortLabel
                  active={orderBy === options.rows[key].id}
                  direction={orderAsc ? 'asc' : 'desc'}
                  onClick={() => handleOrder(options.rows[key].id)}
                >
                  {options.rows[key].displayName}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {items.data && (
            <TableBody>
              {items.data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${column}-${row.id}`}
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
      </Table>
    </Stack>
  ) : (
    <NotFoundView />
  );
};

export default SettingsView;
