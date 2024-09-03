import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { dataSettings } from '@/utils';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { blueGrey, cyan, grey } from '@mui/material/colors';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  handleOrder: (col: number) => void;
  activeItems: PossibleFields[];
  suspendedItems: PossibleFields[];
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
  activeItems,
  suspendedItems,
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
    if (activeItems.length === 0) return;
    selected.length > 0 ? setSelected([]) : setSelected(activeItems.map((item) => item.id));
  };

  useEffect(() => {
    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  useEffect(getLimit, [activeItems.length]);

  return (
    <Stack flex={1} sx={{ overflowX: 'auto' }} ref={tableBody}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={toggleAllRows}
                checked={selected.length === activeItems.length}
                indeterminate={selected.length > 0 && selected.length < activeItems.length}
                color="secondary"
              />
            </TableCell>
            {dataSettings[scope].map((column) => (
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
          {activeItems.map((row) => (
            <DataRow
              key={row.id}
              row={row}
              scope={scope}
              selected={selected}
              toggleRow={toggleRow}
              setAlter={setAlter}
            />
          ))}
          {suspendedItems.map((row) => (
            <DataRow
              key={`s${row.id}`}
              row={row}
              scope={scope}
              selected={selected}
              toggleRow={toggleRow}
              setAlter={setAlter}
              suspended
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
  suspended = false,
}: {
  row: PossibleFields;
  scope: SettingNamesType;
  selected: number[];
  toggleRow: (id: number) => void;
  setAlter: ({ open, id }: { open: boolean; id: number }) => void;
  suspended?: boolean;
}) {
  const background = suspended
    ? selected.includes(row.id)
      ? blueGrey[100]
      : blueGrey[50]
    : selected.includes(row.id)
      ? grey[100]
      : '';
  return (
    <TableRow
      hover
      sx={{
        background: background,
        cursor: 'pointer',
        textDecorationLine: suspended ? 'line-through' : 'none',
      }}
    >
      <TableCell>
        <Checkbox checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
      </TableCell>
      {dataSettings[scope].map((column) => (
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
