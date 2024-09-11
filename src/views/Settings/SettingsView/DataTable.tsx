import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  handleOrder: (col: number) => void;
  items: PossibleFields[];
  orderAsc: boolean;
  orderBy: number;
  scope: SettingNamesType;
  selected: number[];
  setLimit: Dispatch<SetStateAction<number>>;
  setSelected: Dispatch<SetStateAction<number[]>>;
  setAlter: Dispatch<
    SetStateAction<{
      open: boolean;
      id?: number;
    }>
  >;
};

const DataTable = ({
  handleOrder,
  items,
  orderAsc,
  orderBy,
  scope,
  selected,
  setAlter,
  setLimit,
  setSelected,
}: Params) => {
  const { t } = useTranslation();
  const tableBody = useRef<HTMLTableSectionElement | null>(null);

  const getLimit = () => {
    setLimit(
      tableBody && tableBody.current ? Math.max(Math.floor(tableBody.current.clientHeight / 55) - 1 || 10, 1) : 10
    );
  };

  const toggleRow = (id: number) => {
    selected.includes(id) ? setSelected(selected.filter((value) => value !== id)) : setSelected([...selected, id]);
  };

  const toggleAllRows = () => {
    if (items.length === 0) return;
    selected.length > 0 ? setSelected([]) : setSelected(items.map((item) => item.id));
  };

  useEffect(() => {
    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  useEffect(getLimit, [items.length]);

  return (
    <Stack flex={1} sx={{ overflowX: 'auto' }} ref={tableBody}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={toggleAllRows}
                checked={selected.length === items.length}
                indeterminate={selected.length > 0 && selected.length < items.length}
                color="secondary"
              />
            </TableCell>
            {DataConfig[scope].columns.map((column) => (
              <Fragment key={column.name}>
                {column.orderId >= 0 && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <TableSortLabel
                      active={orderBy === column.orderId}
                      direction={orderAsc ? 'asc' : 'desc'}
                      onClick={() => handleOrder(column.orderId)}
                    >
                      {t(`settings.${column.name}`)}
                    </TableSortLabel>
                  </TableCell>
                )}
              </Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <DataRow
              key={row.id}
              row={row}
              scope={scope}
              selected={selected}
              toggleRow={toggleRow}
              setAlter={setAlter}
              status={Number(row.status) as StatusTypes}
            />
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

function DataRow({
  row,
  scope,
  selected,
  toggleRow,
  setAlter,
  status,
}: {
  row: PossibleFields;
  scope: SettingNamesType;
  selected: number[];
  toggleRow: (id: number) => void;
  setAlter: ({ open, id }: { open: boolean; id: number }) => void;
  status: StatusTypes;
}) {
  const getBackground = () => {
    switch (status) {
      case 0:
        return selected.includes(row.id) ? deepOrange[100] : deepOrange[50];
      case 2:
        return selected.includes(row.id) ? deepPurple[100] : deepPurple[50];
      case 3:
        return selected.includes(row.id) ? orange[100] : orange[50];
      default:
        return selected.includes(row.id) ? grey[100] : '';
    }
  };
  return (
    <TableRow
      hover
      sx={{
        background: getBackground,
        cursor: 'pointer',
        textDecorationLine: status !== 1 ? 'line-through' : 'none',
      }}
    >
      <TableCell>
        <Checkbox checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
      </TableCell>
      {DataConfig[scope].columns.map((column) => (
        <Fragment key={`${column.name}-${row.id}`}>
          {column.orderId >= 0 && (
            <TableCell
              sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}
              onClick={() => setAlter({ open: true, id: row.id })}
            >
              {row[column.name]}
            </TableCell>
          )}
        </Fragment>
      ))}
    </TableRow>
  );
}

export default DataTable;
