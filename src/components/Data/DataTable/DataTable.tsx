import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataItem from './DataItem';
import DataRow from './DataRow';
import { databaseRequest } from '@/utils';

/**
 * Props for the DataTable component
 * @typedef {Object} Params
 * @property {Array<{name: keyof PossibleFields; orderId: number}>} columns - Array of column definitions with their names and order IDs
 * @property {Array<Record<keyof PossibleFields, string>>} rows - Array of data rows to display in the table
 * @property {Array<number>} selected - Array of selected row IDs
 * @property {(id: Record<keyof PossibleFields, string>) => void} onClick - Callback function when a row is clicked
 * @property {Dispatch<SetStateAction<Array<number>>>} onSelect - Function to update selected rows
 * @property {(col: number) => void} handleOrder - Function to handle column sorting
 * @property {boolean} orderAsc - Flag indicating if sort order is ascending
 * @property {number} orderBy - Column ID being sorted by
 * @property {Dispatch<SetStateAction<number>>} setLimit - Function to update row limit
 */
type Params = {
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: Array<Record<keyof PossibleFields, string>>;
  selected: Array<number>;
  onClick: (id: Record<keyof PossibleFields, string>) => void;
  onSelect: Dispatch<SetStateAction<Array<number>>>;
  handleOrder: (col: number) => void;
  orderAsc: boolean;
  orderBy: number;
  setLimit: Dispatch<SetStateAction<number>>;
};

/**
 * A dynamic data table component with features like:
 * - Row selection with checkboxes
 * - Column sorting
 * - Custom field support
 * - Responsive layout
 * - Automatic row limit calculation based on viewport height
 *
 * @param {Params} props - Component props
 * @returns {JSX.Element} Rendered data table
 */
const DataTable = ({
  columns,
  rows,
  selected,
  onClick,
  onSelect,
  handleOrder,
  orderAsc,
  orderBy,
  setLimit,
  ...restOfProps
}: Params) => {
  const { t } = useTranslation();
  const tableBody = useRef<HTMLTableSectionElement | null>(null);

  /**
   * State for custom field names retrieved from the database
   */
  const [customFields, setCustomFields] = useState<Record<'custom_field1_name' | 'custom_field2_name', string>>({
    custom_field1_name: '',
    custom_field2_name: '',
  });

  /**
   * Calculates and sets the row limit based on the table's viewport height
   * Ensures optimal display by fitting as many rows as possible in the visible area
   */
  const getLimit = () => {
    setLimit(
      tableBody && tableBody.current ? Math.max(Math.floor(tableBody.current.clientHeight / 55) - 1 || 10, 1) : 10
    );
  };

  /**
   * Toggles selection state for a single row
   * @param {number} id - ID of the row to toggle
   */
  const toggleRow = (id: number) => {
    selected.includes(id) ? onSelect(selected.filter((value) => value !== id)) : onSelect([...selected, id]);
  };

  /**
   * Toggles selection state for all rows
   * Handles special case for room types with type=1
   */
  const toggleAllRows = () => {
    if (rows.length === 0) return;
    selected.length > 0
      ? onSelect([])
      : onSelect(
          rows.map((row) => ('room_name' in row && 'type' in row && Number(row.type) === 1 ? 0 : Number(row.id)))
        );
  };

  /**
   * Fetches custom field names from the database
   * Updates the customFields state with retrieved values
   */
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

  // Add resize event listener to update row limit on window resize
  useEffect(() => {
    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  // Update row limit when rows change
  useEffect(getLimit, [rows.length]);

  // Fetch custom fields when component mounts if needed
  useEffect(() => {
    if ((columns.map((column) => column.name) as string[]).includes('custom_field1_name')) getCustomFields();
  }, []);

  return (
    <Stack flex={1} sx={{ overflowX: 'auto' }} ref={tableBody} {...restOfProps}>
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
              item={row}
              selected={selected.includes(Number(row.id))}
              toggleRow={toggleRow}
              status={Number(row.status) as StatusTypes}
            >
              {columns.map((column) => (
                <Fragment key={column.orderId}>
                  {!(column.name in customFields && customFields[column.name as keyof typeof customFields] === '') && (
                    <TableCell
                      sx={{ overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}
                      onClick={() => onClick(row)}
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
