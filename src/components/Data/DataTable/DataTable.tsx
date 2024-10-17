import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataRow from './DataRow';
import { databaseRequest } from '@/utils';
import DataItem from './DataItem';

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

  const [customFields, setCustomFields] = useState<Record<string, string>>({});

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

  const getCustomFields = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      if (typeof response.data === typeof {}) setCustomFields(response.data);
      else setCustomFields({});
    });
  };

  useEffect(() => {
    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  useEffect(getLimit, [items.length]);

  useEffect(() => {
    if (scope === 'ideas') getCustomFields();
  }, []);

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
            {DataConfig[scope].columns.map((column) => {
              if ((column.name in customFields && customFields[column.name]) || !(column.name in customFields))
                return (
                  <TableCell sx={{ whiteSpace: 'nowrap' }} key={column.name}>
                    <TableSortLabel
                      active={orderBy === column.orderId}
                      direction={orderAsc ? 'asc' : 'desc'}
                      onClick={() => handleOrder(column.orderId)}
                    >
                      {customFields[column.name] || t(`settings.${column.name}`)}
                    </TableSortLabel>
                  </TableCell>
                );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <DataRow
              key={row.id}
              row={row}
              selected={selected}
              toggleRow={toggleRow}
              status={Number(row.status) as StatusTypes}
            >
              {DataConfig[scope].columns.map((column) => (
                <Fragment key={column.orderId}>
                  {((column.name in customFields && customFields[column.name]) || !(column.name in customFields)) && (
                    <TableCell
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}
                      onClick={() => setAlter({ open: true, id: row.id })}
                      key={`${column.name}-${row.id}`}
                    >
                      {column.name in row && <DataItem row={row} column={column.name} />}
                    </TableCell>
                  )}
                </Fragment>
              ))}
            </DataRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default DataTable;
