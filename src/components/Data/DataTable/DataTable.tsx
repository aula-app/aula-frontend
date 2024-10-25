import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataItem from './DataItem';
import DataRow from './DataRow';
import { databaseRequest } from '@/utils';

type Params = {
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: Array<Record<keyof PossibleFields, string>>;
  selected: Array<number>;
  onClick: (id: number) => void;
  onSelect: Dispatch<SetStateAction<Array<number>>>;
  handleOrder: (col: number) => void;
  orderAsc: boolean;
  orderBy: number;
};

const DataTable = ({
  columns,
  rows,
  selected,
  onClick,
  onSelect,
  handleOrder,
  orderAsc,
  orderBy,
  ...restOfProps
}: Params) => {
  const { t } = useTranslation();
  const tableBody = useRef<HTMLTableSectionElement | null>(null);

  const [customFields, setCustomFields] = useState<Record<'custom_field1_name' | 'custom_field2_name', string>>({
    custom_field1_name: '',
    custom_field2_name: '',
  });

  // const getLimit = () => {
  //   setLimit(
  //     tableBody && tableBody.current ? Math.max(Math.floor(tableBody.current.clientHeight / 55) - 1 || 10, 1) : 10
  //   );
  // };

  const toggleRow = (id: number) => {
    selected.includes(id) ? onSelect(selected.filter((value) => value !== id)) : onSelect([...selected, id]);
  };

  const toggleAllRows = () => {
    if (rows.length === 0) return;
    selected.length > 0 ? onSelect([]) : onSelect(rows.map((row) => Number(row.id)));
  };

  const getCustomFields = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (!response.success || !response.data) return;
      setCustomFields(response.data);
    });
  };

  // useEffect(() => {
  //   window.addEventListener('resize', getLimit);
  //   return () => {
  //     window.removeEventListener('resize', getLimit);
  //   };
  // }, []);

  // useEffect(getLimit, [items.length]);

  useEffect(() => {
    if ((columns.map((column) => column.name) as string[]).includes('custom_field1_name')) getCustomFields();
  }, []);

  return (
    <Stack flex={1} sx={{ overflowX: 'auto' }} {...restOfProps}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={toggleAllRows}
                checked={selected.length === rows.length && selected.length > 0}
                indeterminate={selected.length > 0 && selected.length < rows.length}
                color="secondary"
              />
            </TableCell>
            {columns.map(
              (column) =>
                (!(column.name in customFields) || customFields[column.name as keyof typeof customFields] !== '') && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }} key={column.name}>
                    <TableSortLabel
                      active={orderBy === column.orderId}
                      direction={orderAsc ? 'asc' : 'desc'}
                      onClick={() => handleOrder(column.orderId)}
                    >
                      {customFields[column.name as keyof typeof customFields] || t(`settings.${column.name}`)}
                    </TableSortLabel>
                  </TableCell>
                )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <DataRow
              key={row.id}
              id={Number(row.id)}
              selected={selected.includes(Number(row.id))}
              toggleRow={toggleRow}
              status={Number(row.status) as StatusTypes}
            >
              {columns.map((column) => (
                <Fragment key={column.orderId}>
                  {!(column.name in customFields && customFields[column.name as keyof typeof customFields] === '') && (
                    <TableCell
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}
                      onClick={() => onClick(Number(row.id))}
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
