import { StatusTypes } from '@/types/Generics';
import { PossibleFields, SettingType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { Box, Checkbox, Table as MuiTable, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../EmptyState';
import Item from './Item';
import Row from './Row';
import TableSkeleton from './TableSkeleton';

type Props = {
  scope: SettingNamesType;
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: SettingType[];
  selected: Array<string>;
  orderAsc: boolean;
  orderBy: number;
  isLoading?: boolean;
  onReload?: () => void;
  setAsc: Dispatch<SetStateAction<boolean>>;
  setOrderby: Dispatch<SetStateAction<number>>;
  setEdit: (item: SettingType | boolean) => void;
  toggleRow: (id: string) => void;
  toggleAllRows: () => void;
};

/**
 * Pure table component for rendering data rows
 */
const Table: React.FC<Props> = ({
  scope,
  columns,
  rows,
  selected,
  orderAsc,
  orderBy,
  isLoading,
  onReload,
  setAsc,
  setOrderby,
  setEdit,
  toggleRow,
  toggleAllRows,
}) => {
  const { t } = useTranslation();

  const toggleColumn = (order_id: number) => {
    orderBy === order_id ? setAsc(!orderAsc) : setOrderby(order_id);
  };

  return (
    <Box
      sx={{
        overflow: 'auto',
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {isLoading ? (
        <TableSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState title={t(`ui.empty.${scope}.title`)} description={t(`ui.empty.${scope}.description`)} />
      ) : (
        <MuiTable
          stickyHeader
          size="small"
          sx={{ width: 'auto', minWidth: '100%' }}
          aria-label={t(`scopes.${scope}.name`)}
          role="table"
          aria-rowcount={rows.length}
          aria-colcount={columns.length + 2}
        >
          <TableHead role="rowgroup">
            <TableRow sx={{ maxHeight: '55px' }} role="row">
              <TableCell
                sx={{ position: 'sticky', left: 0, zIndex: 3, pl: 1, pr: 0, backgroundColor: 'background.paper' }}
                role="columnheader"
                aria-label={t('ui.select.all')}
              >
                <Checkbox
                  onChange={toggleAllRows}
                  checked={selected.length === rows.length && selected.length > 0}
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  color="secondary"
                  aria-label={t('ui.select.all')}
                  slotProps={{
                    input: {
                      tabIndex: 0,
                      'aria-labelledby': 'select-all-checkbox-label',
                    },
                  }}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  sx={{ whiteSpace: 'nowrap' }}
                  key={column.name}
                  scope="col"
                  aria-sort={column.orderId === orderBy ? (orderAsc ? 'ascending' : 'descending') : 'none'}
                >
                  <TableSortLabel
                    active={column.orderId === orderBy}
                    direction={orderAsc ? 'asc' : 'desc'}
                    onClick={() => toggleColumn(column.orderId)}
                    tabIndex={0}
                    id={`column-sort-${column.name}`}
                    aria-label={t('ui.accessibility.sortColumn', {
                      column: t(`settings.columns.${column.name}`),
                      direction: column.orderId === orderBy ? (orderAsc ? 'ascending' : 'descending') : 'none',
                    })}
                  >
                    {t(`settings.columns.${column.name}`)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                sx={{ position: 'sticky', right: 0, zIndex: 2, px: 0, backgroundColor: 'background.paper' }}
                aria-hidden="true"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody role="rowgroup">
            {rows.map((row, rowIndex) => (
              <Row
                key={`${row.hash_id}-${row.id}`}
                item={row}
                selected={selected.includes(row.hash_id)}
                status={Number(row.status) as StatusTypes}
                toggleRow={toggleRow}
                tabIndex={rowIndex === 0 ? 0 : -1}
                aria-rowindex={rowIndex + 1}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      background: 'inherit',
                    }}
                    onClick={() => setEdit(row)}
                    key={`${row.hash_id}-${row.id}-${column.name}-${colIndex}`}
                    role="cell"
                    aria-colindex={colIndex + 2}
                    tabIndex={-1}
                  >
                    {column.name in row && <Item row={row} column={column.name} onReload={onReload} />}
                  </TableCell>
                ))}
              </Row>
            ))}
          </TableBody>
        </MuiTable>
      )}
    </Box>
  );
};

export default Table;
