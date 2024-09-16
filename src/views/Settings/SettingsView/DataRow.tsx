import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { Fragment } from 'react';
import DataItem from './DataItem';

type Params = {
  row: PossibleFields;
  scope: SettingNamesType;
  selected: number[];
  toggleRow: (id: number) => void;
  setAlter: ({ open, id }: { open: boolean; id: number }) => void;
  status: StatusTypes;
};

const DataRow = ({ row, scope, selected, toggleRow, setAlter, status }: Params) => {
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
              <DataItem row={row} column={column.name} />
            </TableCell>
          )}
        </Fragment>
      ))}
    </TableRow>
  );
};

export default DataRow;
