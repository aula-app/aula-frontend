import ToolBar from '@/components/DataTable/ToolBar';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields, SettingsType, SettingType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { getDataLimit } from '@/utils';
import {
  Box,
  Checkbox,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataItem from './DataItem';
import DataRow from './DataRow';
import EmptyState from '../EmptyState';
import TableSkeleton from './TableSkeleton';

type Props = {
  scope: SettingNamesType;
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: SettingsType;
  orderAsc: boolean;
  orderBy: number;
  isLoading?: boolean;
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  setAsc: Dispatch<SetStateAction<boolean>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setOrderby: Dispatch<SetStateAction<number>>;
  setEdit: (item: SettingType | boolean) => void;
  setDelete: (items: Array<string>) => void;
};

/**
 * A dynamic data table component
 */
const DataTable: React.FC<Props> = ({
  scope,
  columns,
  rows,
  orderAsc,
  orderBy,
  isLoading,
  extraTools,
  setAsc,
  setLimit,
  setOrderby,
  setDelete,
  setEdit,
  ...restOfProps
}) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Array<string>>([]);

  const toggleColumn = (order_id: number) => {
    orderBy === order_id ? setAsc(!orderAsc) : setOrderby(order_id);
  };

  const toggleRow = (id: string) => {
    selected.includes(id) ? setSelected(selected.filter((value) => value !== id)) : setSelected([...selected, id]);
  };

  const toggleAllRows = () => {
    //if (rows.length === 0) return;
    selected.length > 0
      ? setSelected([])
      : setSelected(rows.filter((row) => !('userlevel' in row && row.userlevel >= 50)).map((row) => row.hash_id));
  };

  /**
   * Calculates and sets the row limit based on the table's viewport height
   * Ensures limit is only updated when the limit value is different than it was previously set
   */
  const getLimit = () => {
    setLimit(getDataLimit());
  };

  const handleDelete = () => {
    setDelete(selected);
    setSelected([]);
  };

  const handleEdit = (value: boolean) => {
    setEdit(value);
    setSelected([]);
  };

  useEffect(() => {
    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  return (
    <Stack flex={1} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} {...restOfProps}>
      <ToolBar
        scope={scope}
        selected={selected}
        setEdit={handleEdit}
        setDelete={handleDelete}
        extraTools={extraTools}
      />
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
          <Table
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
                        tabIndex: 0, // Ensure the checkbox is always tabbable
                        'aria-labelledby': 'select-all-checkbox-label',
                      },
                    }}
                  />
                </TableCell>
                {columns.map((column, index) => (
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
                      tabIndex={0} // Make sort labels keyboard accessible
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
                <DataRow
                  key={row.id}
                  item={row}
                  selected={selected.includes(row.hash_id)}
                  status={Number(row.status) as StatusTypes}
                  toggleRow={toggleRow}
                  tabIndex={rowIndex === 0 ? 0 : -1} // Make first row tabbable
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
                      key={`${column.name}-${row.hash_id}`}
                      role="cell"
                      aria-colindex={colIndex + 2} // +2 because of the checkbox column and row header
                      tabIndex={-1} // Not directly tabbable to avoid too many tab stops
                    >
                      {column.name in row && <DataItem row={row} column={column.name} />}
                    </TableCell>
                  ))}
                </DataRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Stack>
  );
};

export default DataTable;
