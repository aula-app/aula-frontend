import {
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { UserTypeKeys, UsersResponseType } from '@/types/UserTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';

interface Props {
  items: UsersResponseType;
  displayRows: UserTypeKeys[];
  reloadMethod: (page: number, limit: number) => Promise<void>;
}

export const ItemsTable = ({ items, displayRows, reloadMethod }: Props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(Math.floor((window.screen.height - 220) / 54) || 10);

  const changeLimit = (event: SelectChangeEvent) => {
    setLimit(Number(event.target.value));
  };

  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    reloadMethod(page, limit);
  }, [page, limit]);

  return (
    <Stack flexGrow={1} minHeight={0}>
      <Stack direction="row" alignItems="center" px={2} pb={2}>
        <Stack direction="row" alignItems="center">
          <Typography fontSize="small" ml="auto" pr={1} noWrap>
            Items per page:
          </Typography>
          <FormControl variant="standard">
            <Select value={String(limit)} onChange={changeLimit}>
              <MenuItem value={limit}>{limit}</MenuItem>
              <MenuItem value={limit * 2}>{limit * 2}</MenuItem>
              <MenuItem value={limit * 5}>{limit * 5}</MenuItem>
              <MenuItem value={limit * 10}>{limit * 10}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          variant="standard"
          sx={{ml: 'auto', pl: 2}}
        />
      </Stack>
      <Divider />
      <Stack overflow="auto" flexGrow={1}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {displayRows.map((row) => (
                <TableCell key={row}>{row}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data.map((item) => (
              <TableRow key={item.id}>
                {displayRows.map((row) => (
                  <TableCell key={`${row}${item.id}`}>{item[row]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
      <Stack direction="row" justifyContent="center">
        <Pagination count={Math.ceil(Number(items.count) / limit)} sx={{ py: 1 }} onChange={changePage} />
      </Stack>
    </Stack>
  );
};

export default ItemsTable;
