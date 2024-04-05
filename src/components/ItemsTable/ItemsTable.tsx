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
  const [limit, setLimit] = useState(20);

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
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          variant="standard"
          />
        <Typography fontSize="small" ml="auto" px={1} noWrap>
          Items per page:
        </Typography>
        <FormControl variant="standard">
          <Select value={String(limit)} onChange={changeLimit}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
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
