import ToolBar from '@/components/DataTable/ToolBar';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields, SettingsType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { getDataLimit } from '@/utils';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataItem from './DataItem';
import DataRow from './DataRow';

type Props = {
  scope: SettingNamesType;
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: SettingsType;
  orderAsc: boolean;
  orderBy: number;
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  setAsc: Dispatch<SetStateAction<boolean>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setOrderby: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<string | boolean>>;
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
    if (rows.length === 0) return;
    selected.length > 0 ? setSelected([]) : setSelected(rows.map((row) => row.hash_id));
  };

  /**
   * Calculates and sets the row limit based on the table's viewport height
   * Ensures limit is only updated when the limit value is different than it was previously set
   */
  const getLimit = () => {
    setLimit(getDataLimit());
  };

  const hendleDelete = () => {
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
    <Stack sx={{ overflowX: 'auto' }} {...restOfProps}>
      <ToolBar
        scope={scope}
        selected={selected}
        setEdit={handleEdit}
        setDelete={hendleDelete}
        extraTools={extraTools}
      />
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow sx={{ maxHeight: '55px' }}>
            <TableCell sx={{ position: 'sticky', left: 0, zIndex: 3, pl: 1, pr: 0 }}>
              <Checkbox
                onChange={toggleAllRows}
                checked={selected.length === rows.length && selected.length > 0}
                indeterminate={selected.length > 0 && selected.length < rows.length}
                color="secondary"
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={column.name}>
                <TableSortLabel
                  active={column.orderId === orderBy}
                  direction={orderAsc ? 'asc' : 'desc'}
                  onClick={() => toggleColumn(column.orderId)}
                >
                  {t(`settings.columns.${column.name}`)}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell sx={{ position: 'sticky', right: 0, zIndex: 2, px: 0 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <DataRow
              key={row.id}
              item={row}
              selected={selected.includes(row.hash_id)}
              status={Number(row.status) as StatusTypes}
              toggleRow={toggleRow}
            >
              {columns.map((column) => (
                <TableCell
                  sx={{ whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() => setEdit(row.hash_id)}
                  key={`${column.name}-${row.hash_id}`}
                >
                  {column.name in row && <DataItem row={row} column={column.name} />}
                </TableCell>
              ))}
            </DataRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default DataTable;
