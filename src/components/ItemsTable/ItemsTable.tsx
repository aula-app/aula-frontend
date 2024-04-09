import {
  Divider,
  Fab,
  InputAdornment,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import { UsersResponseType } from '@/types/UserTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import { Add, Search } from '@mui/icons-material';
import Tables from '@/utils/tables.json';
import { TableOptions } from '@/types/Tables';
import { databaseRequest } from '@/utils/requests';

interface Props {
  table: 'users' | 'groups';
}

export const ItemsTable = ({ table }: Props) => {
  const options = Tables[table] as TableOptions;
  const columns = options.rows.map((value) => value.name);
  const defaultLimit = Math.floor((window.screen.height - 220) / 34) || 10;

  const [items, setItems] = useState({} as UsersResponseType);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(defaultLimit);
  const [orderBy, setOrder] = useState(options.rows[0]['id']);
  const [orderDesc, setOrderDesc] = useState(false);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: options.model,
      method: options.method,
      arguments: {
        limit: limit,
        offset: page * limit,
        orderby: orderBy,
        asc: Number(orderDesc),
      },
      decrypt: columns,
    }).then((response: UsersResponseType) => {
      setItems(response);
    });

  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  const handleOrder = (col: number) => {
    if (orderBy === col) setOrderDesc(!orderDesc);
    setOrder(col);
  };

  useEffect(() => {
    dataFetch();
  }, [page, limit, orderBy, orderDesc]);

  return (
    <Stack flexGrow={1} minHeight={0}>
      <Stack direction="row" alignItems="center" px={2} pb={2}>
        <Fab
          aria-label="add"
          color="primary"
          sx={{
            position: 'absolute',
            bottom: 60,
            right: 20,
          }}
        >
          <Add />
        </Fab>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          variant="standard"
          sx={{ ml: 'auto', pl: 2 }}
        />
      </Stack>
      <Divider />
      <Stack overflow="auto" flexGrow={1}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column, key) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === options.rows[key].id}
                    direction={orderDesc ? 'asc' : 'desc'}
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
                    <TableCell key={`${column}-${row.id}`}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </Stack>
      <Stack direction="row" justifyContent="center">
        {items.count && (
          <Pagination count={Math.ceil(Number(items.count) / limit)} sx={{ py: 1 }} onChange={changePage} />
        )}
      </Stack>
    </Stack>
  );
};

export default ItemsTable;
